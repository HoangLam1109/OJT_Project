import { roomRepository } from "../repositories/index.js";
import type { IRoom } from "../db/models/room.model.js";
import { PaginationOptions, PaginationResponse } from "../../../shared/src/types/pagination.type.js";
import { PaginationUtils } from "../../../shared/src/pagination.util.js";

export class RoomService {
  async getRoomById(roomId: string): Promise<IRoom | null> {
    return roomRepository.findById(roomId);
  }

  async getAllRooms(
    options: PaginationOptions
  ): Promise<PaginationResponse<IRoom>> {
    const result = await roomRepository.findWithPagination(options);
    return PaginationUtils.formatResponse(
      result.data,
      result.hasNextPage,
      options,
      result.totalCount
    );
  }

  async getRoomsByParticipant(userId: string): Promise<IRoom[]> {
    return roomRepository.findManyByParticipant(userId);
  }

  async createRoom(name: string | undefined, participants: string[]): Promise<IRoom> {
    return roomRepository.create({
      name,
      participants,
    });
  }

  async updateRoom(roomId: string, data: Partial<{ name?: string; participants: string[] }>): Promise<IRoom | null> {
    const room = await roomRepository.findById(roomId);
    if(!room) {
      throw new Error("Room not found");
    }

    if(data.name && room.name == data.name) {
      throw new Error("Room with current name already exists");
    }

    if (
      data.participants &&
      data.participants.every((participant) => room.participants.includes(participant))
    ) {
      throw new Error("Room with current participants already exists");
    }
    return roomRepository.updateById(roomId, data);
  }

  async deleteRoom(roomId: string): Promise<IRoom | null> {
    return roomRepository.deleteById(roomId);
  }

  async joinRoom(roomId: string, userId: string): Promise<IRoom | null> {
    const room = await this.getRoomById(roomId);
    if(room?.participants.includes(userId)) {
      throw new Error("User already in room");
    }
    return roomRepository.joinRoom(roomId, userId);
  }

  async leaveRoom(roomId: string, userId: string): Promise<IRoom | null> {
    return roomRepository.leaveRoom(roomId, userId);
  }
}
