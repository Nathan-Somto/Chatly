import cloudinary from 'cloudinary';
const uploadFile = async (file: string) => {
    const result =  await cloudinary.v2.uploader.upload(
        file,
        {folder : 'user'}
    );
    return result.secure_url
}
export {uploadFile}