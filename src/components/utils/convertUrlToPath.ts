export const getPathStorageFromUrl = (url: string) => {

    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/du-lich-cau-ke.appspot.com/o/";
    let imagePath: string = url.replace(baseUrl, "");

    const indexOfEndPath = imagePath.indexOf("?");

    imagePath = imagePath.substring(0, indexOfEndPath);

    imagePath = imagePath.replace(/%2F/g, "/");

    imagePath = imagePath.replace(/%20/g, " ");

    return imagePath;
}