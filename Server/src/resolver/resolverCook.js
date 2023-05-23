const db = require('../data/knex-db');
const { saveFile, deleteFile, downloadFile, existFile, convertFileName } = require('../common/handleFile');

const resolver = {
    Query: {
        getListCook: (async (parent, args, context) => {
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

        searchCook: (async (parent, args, context) => {
            try {

                let listData = await db.table('Cook').where('Ten', 'ilike',  '%' + args.bodyData.Ten.trim() + '%')

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


        getListCookByID: async (parent, args) => {
            let Data = await db.table('Cook').where('Id', args.Id)

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
                    let Cook = await trx.table('Cook').returning(['Id']).insert({
                        Ten: dataCook.Ten,
                        MoTa: dataCook.MoTa,
                    })

                    //Upload image
                    // let url = null;
                    // let file = args.bodyData.dataCook.Anh;
                    // if (file) {
                    //     let { filename, mimetype, createReadStream } = await file;
                    //     //Save url to db
                    //     let _fileNameIndex = filename.lastIndexOf('.');
                    //     let _fileName = filename.substring(0, _fileNameIndex) + '_' + Cook[0].Id;
                    //     let _fileType = filename.substring(_fileNameIndex);
                    //     url = '/Cook/' + _fileName + _fileType;
                    //     //save file to directory
                    //     await saveFile([file], 'Cook', _fileName + _fileType);
                    // }


                    // await trx.table('Cook')
                    //     .where('Id', Cook[0].Id)
                    //     .update({
                    //         Anh_Url: url,
                    //     });

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


        UpdateCook: (async (parent, args, context) => {
            try {
                let Cook = await db.table('Cook').where('Id', args.bodyData.dataCook.Id).first()
                if (!Cook) {
                    return {
                        messageCode: 404,
                        message: 'Không tìm thấy cook!',
                    }
                }

                let trx_result = await db.transaction(async trx => {

                    await trx.table('Cook').where('Id', args.bodyData.dataCook.Id).update(args.bodyData.dataCook)

                    // cập nhật lại ảnh nếu có                    
                    // if (args.bodyData.Anh) {
                    //     if (Cook.Anh_Url) {
                    //         // Xóa ảnh cũ nếu có
                    //         let index = Cook.Anh_Url.lastIndexOf('/') + 1;
                    //         let fileName = Cook.Anh_Url.substring(index);
                    //         if (existFile(fileName, 'Cook')) {
                    //             deleteFile([Cook.Anh_Url])
                    //         }
                    //     }
                    //     let { filename, mimetype, createReadStream } = await args.bodyData.Anh;
                    //     //Save url to db
                    //     let _fileNameIndex = filename.lastIndexOf('.');
                    //     let _fileName = filename.substring(0, _fileNameIndex) + '_' + Cook_Id;
                    //     let _fileType = filename.substring(_fileNameIndex);
                    //     let url_Anh = '/Cook/' + _fileName + _fileType;

                    //     //save file to directory
                    //     await saveFile([args.bodyData.Anh], 'Cook', _fileName + _fileType);
                    //     await trx.table('Cook').where('Id', Cook_Id).update({ Anh_Url: url_Anh });
                    // }
                    return {
                        messageCode: 200,
                        message: 'Cập nhật câu lạc bộ thành công!',
                    }
                });
                return trx_result;
            }
            catch (err) {
                return {
                    messageCode: 500,
                    message: err.toString(),
                }
            }
        }),
        DeleteCook: (async (parent, args, context) => {
            try {
                let Id = args.Id
                let Cook = await db.table('Cook').where('Id', Id)
                if (Cook.length == 0) {
                    return {
                        messageCode: 404,
                        message: 'Không tìm thấy Cook!',
                    }
                }
                let trx_result = await db.transaction(async trx => {
                    await trx.table('Cook').where('Id', Id).del()

                    return {
                        messageCode: 200,
                        message: 'Xóa Cook thành công!',
                    }
                })
                return trx_result;
            }
            catch (err) {
                return {
                    messageCode: 500,
                    message: err.toString(),
                }
            }
        }),

    }
}
module.exports = resolver
