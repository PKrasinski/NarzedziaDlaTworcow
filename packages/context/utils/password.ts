export const hashPassword = async (password: string) => {
  const passwordHash = await Bun.password.hash(password);
  return passwordHash;
};

export const verifyPassword = async (password: string, hash: string) => {
  return await Bun.password.verify(password, hash);
};
