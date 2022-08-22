export const userById = async (event: any) => {
  return {
    body: JSON.stringify({ todoId: 1, text: "walk the dog 🐕" }),
    statusCode: 200,
  };
};
