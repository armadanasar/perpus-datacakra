exports.validateBySchema = async (obj, schema) => {
  try {
    const { value, error } = await schema.validate(obj);

    if (error) throw error;

    return value;
  } catch (err) {
    throw err;
  }
};
