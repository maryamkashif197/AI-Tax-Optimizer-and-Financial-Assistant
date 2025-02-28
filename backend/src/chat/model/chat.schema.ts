import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat  {
  @Prop({ default:[] })
  messages: any[];

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;

  @Prop({ required: true, ref: 'User' })
  userId: string;

  readonly _id?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);