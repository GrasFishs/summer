import { Repository } from '../../lib/decorator/Controller';

const users = [
  {
    id: '1',
    name: 'Bob'
  },
  {
    id: '2',
    name: 'Marry'
  },
  {
    id: '3',
    name: 'Tom'
  }
];

@Repository
export default class UserRepository {
  getUsers() {
    return users;
  }

  getUser(id) {
    return users.find(user => user.id === id) || null;
  }

  addUser(user) {
    users.push(user);
    return true;
  }
}
