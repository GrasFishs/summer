import { Service, AutoWired } from '../../lib';
import UserRepository from '../repository/UserRepository';

@Service
export default class UserService {
  @AutoWired
  private userRepository: UserRepository;

  getUsers() {
    return this.userRepository.getUsers();
  }

  getUser(id) {
    return this.userRepository.getUser(id);
  }

  addUser(user) {
    return this.userRepository.addUser(user);
  }
}
