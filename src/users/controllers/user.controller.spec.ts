import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository, // Use the actual Repository class
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('findOne', () => {
    it('should return the user data when valid payload is provided', async () => {
      // Mock the UserService method
      jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue({ fullname: 'Juan Perez' });

      const payload = { username: 'admin', password: 'admin' };

      const result = await userController.findOne(payload);

      expect(result).toEqual({ fullname: 'Juan Perez' });
    });

    it('should throw a NotFoundException when user is not found', async () => {
      // Mock the UserService method to throw a NotFoundException
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(new NotFoundException('User not found'));

      // Provide a payload with a non-existing username
      const payload = { username: 'nonexistent', password: 'password' };

      await expect(userController.findOne(payload)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a BadRequestException when incorrect password is provided', async () => {
      // Mock the UserService method to throw a BadRequestException
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(new BadRequestException('Incorrect password'));

      // Provide a payload with an incorrect password
      const payload = { username: 'admin', password: 'incorrect' };

      await expect(userController.findOne(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
