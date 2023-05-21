const fs = require('fs');
const path = require('path');
const { unlinkSync } = require('fs');


const handleFile = {
  saveFileBase64: async (dataBase64, folderUrl, filename) => {
    try {
      let fileContents = Buffer.from(dataBase64, 'base64');
      let locaiton = path.join(__dirname, `../upload/${folderUrl}/`, `${filename}`);
      fs.writeFileSync(locaiton, fileContents);
    }
    catch (e) {
      throw new Error(e)
    }
  },
  saveFile: async (files, folderUrl, _fileName = null) => {
    try {
      for (let file of files) {
        let { filename, mimetype, createReadStream } = await file;
        let location = _fileName ? path.join(__dirname, `../upload/${folderUrl}/`, `${_fileName}`) : 
          path.join(__dirname, `../upload/${folderUrl}/`, `${filename}`);
        let myfile = createReadStream();
        await myfile.pipe(fs.createWriteStream(location));
      }
    }
    catch (e) {
      throw new Error(e)
    }
  },
  deleteFile: (listUrl) => {
    try {
      for (let url of listUrl)
        unlinkSync(path.join(__dirname, `../upload/${url}`));
    }
    catch (e) {
      throw new Error(e)
    }
  },
  
  convertFileName: (fileName) => {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let millisecond = now.getMilliseconds();
    let date = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    let postfix = '_' + date + month + year + hour + minute + second + millisecond;

    return fileName + postfix;
  }
}

module.exports = handleFile;