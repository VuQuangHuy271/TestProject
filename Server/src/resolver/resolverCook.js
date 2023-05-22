const db = require('../data/knex-db');
const { saveFile, deleteFile, downloadFile, existFile, convertFileName } = require('../common/handleFile');

const resolver = {
    Query : {
        getListCook: (async (parent, args, context) =>  {
            try {
                let listData = await db.table('Cook')
                return {
                    listData,
                    messageCode: 200,
                    message: 'Lấy thông tin thành công!',
                }
            }
            catch (err) {
                return {
                    messageCode: 500,
                    message: err.toString(),
                }
            }
        }),

        getListCookByID: async (parent, args) =>  {
            let Data = await db.table('Cook').where('Id', args.Id).first()

            try {
                if (!Data) {
                    return {
                        messageCode: 404,
                        message: 'Không tìm thấy công thức nấu ăn!',
                    }
                }
                
                return {
                    Data,
                    messageCode: 200,
                    message: 'Lấy thông tin thành công!',
                }
            }
            catch (err) {
                return {
                    messageCode: 500,
                    message: err.toString(),
                }
            }
            
        }
    },

    //MUTATION
    Mutation: {
        CreateCook: (async (parent, args, context) => {
            try {
                
                let trx_result = await db.transaction(async trx => {
                    let dataCook = args.bodyData.dataCook
                    // let Cook = await trx.table('Cook').returning(['Id']).insert({
                    //     Ten: dataCook.Ten,
                    //     MoTa: dataCook.MoTa,
                    // })

                    //Upload image
                    let url = null;
                    let file = args.bodyData.dataCook.Anh;
                    if (file) {
                        let { filename, mimetype, createReadStream } = await file;
                        //Save url to db
                        let _fileNameIndex = filename.lastIndexOf('.');
                        let _fileName = filename.substring(0, _fileNameIndex) + '_' + Cook[0].Id;
                        let _fileType = filename.substring(_fileNameIndex);
                        url = '/Cook/' + _fileName + _fileType;
                        //save file to directory
                        await saveFile([file], 'Cook', _fileName + _fileType);
                    }


                    await trx.table('Cook')
                        .where('Id', Cook[0].Id)
                        .update({
                            Anh_Url: url,
                        });

                    return {
                        messageCode: 200,
                        message: 'Thêm công thức nấu ăn thành công!',
                    }
                });
                return trx_result;
            }
            catch (err) {
                logging(context, err);
                return {
                    messageCode: 500,
                    message: err.toString(),
                }
            }
        }),

        singleUpload: (parent, args) => {
            return args.file.then(async file => {
                //Upload image
                let url = null;
                // let file = args.file;
                if (file) {
                    let { filename, mimetype, createReadStream } = await file;
                    //Save url to db
                    let _fileNameIndex = filename.lastIndexOf('.');
                    let _fileName = filename.substring(0, _fileNameIndex) + '_' + Cook[0].Id;
                    let _fileType = filename.substring(_fileNameIndex);
                    url = '/Cook/' + _fileName + _fileType;
                    //save file to directory
                    await saveFile([file], 'Cook', _fileName + _fileType);
                }
              //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
              //file.createReadStream() is a readable node stream that contains the contents of the uploaded file
              //node stream api: https://nodejs.org/api/stream.html
                return url;
            });
        },

    }
}
module.exports = resolver
