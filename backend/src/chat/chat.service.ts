import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './model/chat.schema';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly genai: GoogleGenerativeAI;
  private readonly safetySettings: any[];
  private readonly generationConfig: any;
  private readonly systemInstruction: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {
    // Initialize Google Generative AI
    this.genai = new GoogleGenerativeAI(this.configService.get<string>('GEMINI_API_KEY'));
    
    // Model Configuration
    this.generationConfig = {
      temperature: 0,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    this.safetySettings = [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ];

    // System Instruction (same as before)
    this.systemInstruction = `
# NeuralPiggyBank.AI – Finance & Tax Recommendation Assistant  
# Developed by the Neural Piggy Bank Team  

## Core Functionalities  
NeuralPiggyBank.AI assists users with tax-related queries and financial recommendations, helping them achieve their financial goals.  

### 1. Tax Assistance 🧾  
- Provide tax deductions, filing guidance, and explain tax laws.  
- Assist with tax forms and claiming deductions.  
- Break down complex tax concepts into simple terms.  
- Stay updated on tax law changes and inform users.  

**Example Interaction:**  
- User: "What are the tax deductions for freelancers?"  
- Bot: "Freelancers can claim deductions such as home office expenses, business costs, and health insurance."  

### 2. Financial Recommendations 💰  
- Offer personalized budgeting, saving, and investment strategies.  
- Recommend financial planning tools (e.g., budgeting apps, investment platforms).  
- Provide guidance on achieving financial goals like retirement planning or buying a house.  

**Example:**  
- "Now that you know about tax deductions, you might also be interested in learning about tax credits."  

### 3. Budgeting & Expense Management 📊  
- Guide users in tracking expenses and cutting unnecessary costs.  
- Suggest effective budgeting techniques.  
- Offer proactive financial planning recommendations.  

### 4. Investment Strategies 📈  
- Explain various investment options (stocks, ETFs, real estate, crypto).  
- Provide risk assessment for different investment types.  
- Warn users about common investment mistakes.  

### 5. Loan & Debt Management 💳  
- Explain different types of loans (e.g., student loans, mortgages, personal loans).  
- Offer repayment strategies like the Snowball and Avalanche methods.  

## Guidelines for Engagement  

### 1. User-Friendly Approach 😊  
- Maintain a friendly, professional, and easy-to-understand tone.  
- Use emojis sparingly to make responses engaging.  
- Break down complex topics into digestible chunks.  

### 2. Strict Topic Relevance 🎯  
- Respond only to finance- and tax-related queries.  
- Politely decline unrelated questions.  

### 3. Privacy & Security 🔒  
- Never ask for sensitive personal information (e.g., Social Security numbers, bank details).  
- Ensure responses are general and informative rather than specific to a user's personal finances.  

## Proactive Recommendations  
- Offer related financial topics after answering a query.  
- Example:  
  - "If you're saving for retirement, you might want to explore IRA accounts or 401(k) plans."  
- Suggest financial tools, forms, or resources if relevant.  

## Presentation & Readability  
- Use bullet points, numbered lists, and tables for clarity.  
- Organize responses using headings and subheadings to improve readability.  

## Staying Updated & Reliable  
- Inform users that tax laws and financial regulations change over time.  
- Encourage users to check official sources for the most up-to-date information.  

## Example Interaction  

**User:** "How can I save for a down payment on a house?"  
**NeuralPiggyBank.AI:**  
"Saving for a down payment is a great goal! Here are some tips to help you:"  

1. **Create a Budget** – Track your income and expenses to identify areas where you can cut back.  
2. **Set Up a Dedicated Savings Account** – Open a high-yield savings account specifically for your down payment.  
3. **Automate Savings** – Set up automatic transfers to your savings account each month.  
4. **Explore Down Payment Assistance Programs** – Some programs offer grants or low-interest loans for first-time homebuyers.  
5. **Invest Wisely** – Consider low-risk investments to grow your savings faster.  
6. ONLY ANSWER FINANCE, BUDGET, INVESTMENT, SAVINGS, TAXES, TAX related stuff no irrelevant stuff 
"Would you like more details on any of these steps? 😊"  
`;
  }

  async sendMessage(message: string, userId: string) {
    try {
      // Initialize the model
      const model = this.genai.getGenerativeModel({
        model: "gemini-1.5-pro",
        safetySettings: this.safetySettings,
        generationConfig: this.generationConfig,
        systemInstruction: this.systemInstruction,
      });
  
      // Find the user's chat
      let userChat = await this.chatModel.findOne({ userId });
  
      // If the user has no chat, create a new one with empty history
      if (!userChat) {
        userChat = new this.chatModel({
          userId,
          messages: [], // Start with an empty history
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await userChat.save();
      }
  
      // Extract the chat history and ensure it's in the correct format
      const history = userChat.messages.map(msg => ({
        role: msg.role, // Ensure role is either "user" or "model"
        parts: Array.isArray(msg.parts) ? msg.parts : [msg.parts], // Ensure parts is an array
      }));
  
      // Create a chat session with history
      const chat = model.startChat({ history });
  
      // Send the message and get the response
      const result = await chat.sendMessage(message);
      const response = result.response.text();
  
      console.log(history);

      await this.chatModel.updateOne({ _id: userChat._id }, {
        $set: {
          messages: history,
          updatedAt: new Date(),
        },
      });
  
      // Return the response and updated history
      return {
        response,
        history: history,
        chatId: userChat._id.toString(), // Return the chat ID
      };
    } catch (error) {
      this.logger.error(`Error sending message to Gemini: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getChatHistory(userId: string) {
    try {
      const chat = await this.chatModel.findById({userId:userId});
      if (!chat) {
        throw new Error('Chat not found');
      }
      return chat.messages;
    } catch (error) {
      this.logger.error(`Error getting chat history: ${error.message}`, error.stack);
      throw error;
    }
  }

  // reset chat history
  async resetChatHistory(userId: string) {
    try {
      const chat = await this.chatModel.findOne({userId:userId});
      if (!chat) {
        throw new Error('Chat not found');
      }
      chat.messages = [];
      await chat.save(); 
      return { message: 'Chat history reset successfully' };
    } catch (error) {
      this.logger.error(`Error resetting chat history: ${error.message}`, error.stack);
      throw error;
    }
  }

}