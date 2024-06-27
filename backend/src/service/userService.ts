import { eq } from "drizzle-orm";
import db from "../db";
import { user } from "../db/schema";
import type { UserSelect } from "../types/user";

class UserService {
  static async updateUser(userToUpdate: Partial<UserSelect>) {
    console.log('userToUpdate',userToUpdate)
    const updatedUser = await db.update(user).set(userToUpdate).returning({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email_verified:user.email_verified,
    });
    return updatedUser;
  }

  static async findUserByEmail(email:string){
    const getUser =  await db.query.user.findFirst({
      where:eq(user.email,email),
      columns:{
        password:false 
      }
    })
    return getUser;
  }
}

export default UserService;
