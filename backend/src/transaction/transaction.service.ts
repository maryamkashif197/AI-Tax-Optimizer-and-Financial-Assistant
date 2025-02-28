import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transaction, TransactionDocument } from "./model/transaction.schema";
import { CreateTransactionDto } from "./dtos/transaction.dto";
import { UpdateTransactionDto } from "./dtos/transaction.dto";
import { v4 as uuidv4 } from 'uuid'; // For generating unique transaction IDs
import * as fs from 'fs'; // For reading deduction_policy.json
import * as tf from '@tensorflow/tfjs-node'; // For loading the tax_classifier.h5 model

@Injectable()
export class TransactionService {
  private deductionPolicy: { deductions: Array<{ category: string; rate: number; max_limit: number }> };
  private deductibleKeywords: string[] = [
    'business', 'office', 'supplies', 'equipment', 'software', 'training', 
    'education', 'travel', 'conference', 'insurance', 'utilities', 'rent', 
    'advertising', 'marketing', 'legal', 'accounting', 'consulting', 'professional',
    'subscription', 'domain', 'hosting', 'repair', 'maintenance'
  ];
  
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>) {
    this.loadDeductionPolicy();
  }

  private loadDeductionPolicy() {
    try {
      const policyData = fs.readFileSync('./src/transaction/deduction_policy.json', 'utf-8');
      this.deductionPolicy = JSON.parse(policyData);
    } catch (error) {
      console.error('Failed to load deduction policy:', error);
      // Set a default empty policy
      this.deductionPolicy = { deductions: [] };
    }
  }

  private predictDeductibleFromDescription(description: string): boolean {
    // Convert description to lowercase for case-insensitive matching
    const lowerDesc = description.toLowerCase();
    
    // Check if any keywords appear in the description
    for (const keyword of this.deductibleKeywords) {
      if (lowerDesc.includes(keyword)) {
        return true;
      }
    }
    
    // If no keywords matched, also check if the category is typically deductible
    const categoryDeductible = this.deductionPolicy.deductions.some(policy => 
      policy.rate > 0 && lowerDesc.includes(policy.category.toLowerCase())
    );
    
    return categoryDeductible;
  }

  async create(transaction: CreateTransactionDto, user_id: string): Promise<Transaction> {
    // Step 1: Add user_id to the transaction object
    transaction.user_id = user_id;

    // Step 2: Generate a unique transaction ID using UUID
    transaction.transaction_id = uuidv4();

    // Step 3: Use deduction_policy.json to get deduction_rate and max_limit

    const categoryPolicy = this.deductionPolicy.deductions.find(
      policy => policy.category === transaction.category
    );
    
    if (categoryPolicy) {
      transaction.deduction_rate = categoryPolicy.rate;
      transaction.max_limit = categoryPolicy.max_limit;
    } else {
      // Default values if category is not found in deduction_policy.json
      transaction.deduction_rate = 0;
      transaction.max_limit = 0;
    }
    
    // Step 4: Determine if transaction is tax-deductible using rule-based system
    if (transaction.description) {
      transaction.tax_deductible = this.predictDeductibleFromDescription(transaction.description);
    } else {
      transaction.tax_deductible = false;
    }
    
    // Create and save the transaction
    const newTransaction = new this.transactionModel(transaction);
    return newTransaction.save();
  }

  // Update A Transaction Based On New-Data
  async update(id: string, updateData: UpdateTransactionDto, user_id:string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    if(transaction.user_id != user_id) {
      throw new UnauthorizedException("You are not authorized to perform this action");
    }
    
    // If description is updated, re-evaluate tax_deductible status
    if (updateData.description) {
      updateData.tax_deductible = this.predictDeductibleFromDescription(updateData.description);
    }
    
    // If category is updated, re-evaluate deduction_rate and max_limit
    if (updateData.category) {
      console.log(this.deductionPolicy.deductions + '\n');
      const categoryPolicy = this.deductionPolicy.deductions.find(
        policy => policy.category === updateData.category
      );
      
      if (categoryPolicy) {
        updateData.deduction_rate = categoryPolicy.rate;
        updateData.max_limit = categoryPolicy.max_limit;
      }
    }
    
    const updatedTransaction = await this.transactionModel.findByIdAndUpdate({ _id: id }, updateData, { new: true }).exec();
    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return updatedTransaction;
  }

  // Delete A Transaction
  async delete(id: string, user_id: string): Promise<void> {
    const result = await this.transactionModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    if(result.user_id != user_id) {
      throw new UnauthorizedException("You are not authorized to perform this action");
    }
    await this.transactionModel.findByIdAndDelete(id).exec();
  }

  // Get All Transactions
  async findAll(user_id: string): Promise<Transaction[]> {
    return this.transactionModel.find({ user_id:user_id }).exec();
  }

  // Find A Specific Transaction by ID
  async findOne(id: string, user_id:string): Promise<Transaction> {
    // check if its the users
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    if (transaction.user_id !== user_id) {
      throw new UnauthorizedException("You are not authorized to perform this action");
    }
    return this.transactionModel.findById(id).exec();
  }
}