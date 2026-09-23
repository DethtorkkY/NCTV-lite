declare module "bcryptjs" {
  const bcrypt: { compare(password: string, hash: string): Promise<boolean> };
  export default bcrypt;
}
