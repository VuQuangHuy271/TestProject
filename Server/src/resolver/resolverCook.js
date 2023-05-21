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
        // UpdateCauLacBo: authenticated(async (parent, args, context) => {
        //     try {
        //         let cauLacBo_Id = args.bodyData.dataCauLacBo.Id
        //         let listHocSinh = args.bodyData.dataHocSinh
        //         let listLich = args.bodyData.dataLich
        //         let cauLacBo = await db.table('CauLacBo').where('Id', cauLacBo_Id).first()
        //         if (!cauLacBo) {
        //             return {
        //                 messageCode: 404,
        //                 message: 'Không tìm thấy câu lạc bộ!',
        //             }
        //         }

        //         let trx_result = await db.transaction(async trx => {
        //             args.bodyData.dataCauLacBo.UpdatedBy = context.currentUser.Id
        //             args.bodyData.dataCauLacBo.UpdatedDate = new Date()
        //             await trx.table('CauLacBo').where('Id', cauLacBo_Id).update(args.bodyData.dataCauLacBo)
        //             let listHS = await trx.table('CauLacBo_HocSinh').where('CauLacBo_Id', cauLacBo_Id)
        //             let listHS_Id = listHS.map(x => x.HocSinh_Id)
        //             let listIdhsDel = []
        //             let listHsAdd = []
        //             listHS_Id.forEach(x => {
        //                 let check = listHocSinh.find(y => y.Id == x)
        //                 if (!check) listIdhsDel.push(x)
        //             })

        //             let themHs = listHocSinh.filter(y => !listHS_Id.includes(y.Id))
        //             if (themHs.length > 0) {

        //                 themHs.forEach(y => {
        //                     let data = {
        //                         CauLacBo_Id: cauLacBo_Id,
        //                         HocSinh_Id: y.Id,
        //                         Lop_Id: y.Lop_Id,
        //                         TrangThai: y.TrangThai,
        //                         CreatedBy: context.currentUser.Id,
        //                     }
        //                     listHsAdd.push(data)
        //                 })
        //             }
        //             let listHsUpdate = listHocSinh.filter(x => !listIdhsDel.includes(x.Id))

        //             if (listHS_Id.length == 0) {
        //                 listHsAdd = []
        //                 listHocSinh.forEach(y => {
        //                     let data = {
        //                         CauLacBo_Id: cauLacBo_Id,
        //                         HocSinh_Id: y.Id,
        //                         Lop_Id: y.Lop_Id,
        //                         NgayDuyet: y.NgayDuyet,
        //                         DaThuTien: y.DaThuTien,
        //                         CreatedBy: context.currentUser.Id
        //                     }
        //                     listHsAdd.push(data)
        //                 })
        //             }

        //             //Xóa hs không có trong ds gửi lên
        //             if (listIdhsDel.length > 0) await trx.table('CauLacBo_HocSinh').whereIn('HocSinh_Id', listIdhsDel).andWhere("TrangThai", "!=", 4).del()
        //             //Xóa hs ở các lịch chưa đc điểm danh
        //             if (listIdhsDel.length > 0) await trx.table('CauLacBo_Lich_HocSinh').whereIn('HocSinh_Id', listIdhsDel).andWhere({ DiemDanh: 3, CauLacBo_Id: cauLacBo_Id }).del()
        //             //Cập nhật trạng thái, lớp cho hs cũ
        //             for (let i = 0; i < listHsUpdate.length; i++) {
        //                 await trx.table('CauLacBo_HocSinh').where({ CauLacBo_Id: cauLacBo_Id, HocSinh_Id: listHsUpdate[i].Id }).update({
        //                     TrangThai: listHsUpdate[i].TrangThai,
        //                     Lop_Id: listHsUpdate[i].Lop_Id,
        //                     IsDangKy: listHsUpdate[i].IsDangKy,
        //                     NgayDuyet: listHsUpdate[i].NgayDuyet,
        //                     DaThuTien: listHsUpdate[i].DaThuTien,
        //                 })
        //             }
        //             //Thêm học sinh mới 
        //             if (listHsAdd.length > 0) await trx.table('CauLacBo_HocSinh').insert(listHsAdd)

        //             let _listLich = await trx.table('CauLacBo_Lich').where('CauLacBo_Id', cauLacBo_Id)
        //             let _listLich_Id = _listLich.map(x => x.Id)

        //             let listIdLichDel = []
        //             let listLichUpdate = []
        //             let listLichAdd = []

        //             _listLich_Id.forEach(x => {
        //                 let check = listLich.find(y => y.Id == x)
        //                 if (!check) listIdLichDel.push(x)
        //                 if (check) listLichUpdate.push(check)
        //             })
        //             let themLich = listLich.filter(y => y.Id == null)
        //             if (themLich.length > 0) {
        //                 themLich.forEach(y => {
        //                     let data = {
        //                         Ngay: y.Ngay,
        //                         ThoiGianTu: y.ThoiGianTu,
        //                         ThoiGianDen: y.ThoiGianDen,
        //                         GhiChu: y.GhiChu,
        //                         CauLacBo_Id: cauLacBo_Id,
        //                     }
        //                     listLichAdd.push(data)
        //                 })
        //             }

        //             // Nếu có thay đổi lịch -> xóa lịch cũ chưa điểm danh thêm lại
        //             if (listLichAdd.length > 0) {
        //                 for (let i = 0; i < listLichAdd.length; i++) {
        //                     let cauLacBo_Lich = await trx.table('CauLacBo_Lich').returning(['Id']).insert(listLichAdd[i])
        //                     //Nếu có học sinh 
        //                     if (listHocSinh.length > 0) {
        //                         let listDataHSInsert = []
        //                         for (let j = 0; j < listHocSinh.length; j++) {
        //                             let dataHs = {
        //                                 CauLacBo_Id: cauLacBo_Id,
        //                                 CauLacBo_Lich_Id: cauLacBo_Lich[0].Id,
        //                                 HocSinh_Id: listHocSinh[j].Id,
        //                                 Lop_Id: listHocSinh[j].Lop_Id,
        //                                 CreatedBy: context.currentUser.Id
        //                             }
        //                             listDataHSInsert.push(dataHs)
        //                         }
        //                         await trx.table('CauLacBo_Lich_HocSinh').insert(listDataHSInsert)
        //                     }
        //                 }
        //             }

        //             //Không thay đổi lịch, thay đổi hs
        //             if (listLichAdd.length == 0 && listHsAdd.length > 0) {
        //                 await trx.table('CauLacBo_Lich_HocSinh').where('DiemDanh', 3).andWhere('CauLacBo_Id', cauLacBo_Id).del()

        //                 let listDataHSInsert = []
        //                 for (let i = 0; i < _listLich_Id.length; i++) {
        //                     for (let j = 0; j < listHocSinh.length; j++) {

        //                         //Lưu lại lịch cho các học sinh có trạng thái hoạt động
        //                         let hocSinh = listHsAdd.find(x => x.HocSinh_Id == listHocSinh[j].Id);
        //                         if (hocSinh) {
        //                             //Chỉ lưu cho học sinh đang hoạt động
        //                             if (hocSinh.TrangThai == 1) {
        //                                 let dataHs = {
        //                                     CauLacBo_Id: cauLacBo_Id,
        //                                     CauLacBo_Lich_Id: _listLich_Id[i],
        //                                     HocSinh_Id: listHocSinh[j].Id,
        //                                     Lop_Id: listHocSinh[j].Lop_Id,
        //                                     CreatedBy: context.currentUser.Id
        //                                 }
        //                                 listDataHSInsert.push(dataHs)
        //                             }
        //                         }

        //                     }
        //                 }
        //                 if (listDataHSInsert.length > 0) await trx.table('CauLacBo_Lich_HocSinh').insert(listDataHSInsert)
        //             }

        //             // Cập nhật lịch cũ 
        //             for (let i = 0; i < listLichUpdate.length; i++) {
        //                 await trx.table('CauLacBo_Lich').where({ Id: listLichUpdate[i].Id }).update({
        //                     ThoiGianTu: new Date(listLichUpdate[i].ThoiGianTu),
        //                     ThoiGianDen: new Date(listLichUpdate[i].ThoiGianDen),
        //                 })
        //             }

        //             // Xóa lịch không có trong ds gửi lên
        //             if (listIdLichDel.length > 0) {
        //                 await trx.table('CauLacBo_Lich_HocSinh').whereIn('CauLacBo_Lich_Id', listIdLichDel).del()
        //                 await trx.table('CauLacBo_Lich').whereIn('Id', listIdLichDel).del()
        //             }
        //             //cập nhật lại ảnh nếu có
        //             if (args.bodyData.anh) {
        //                 if (cauLacBo.Anh_Url) {
        //                     // Xóa ảnh đại diện cũ nếu có
        //                     let index = cauLacBo.Anh_Url.lastIndexOf('/') + 1;
        //                     let fileName = cauLacBo.Anh_Url.substring(index);
        //                     if (existFile(fileName, 'CauLacBo')) {
        //                         deleteFile([cauLacBo.Anh_Url])
        //                     }
        //                 }

        //                 let { filename, mimetype, createReadStream } = await args.bodyData.anh;

        //                 //Save url to db
        //                 let _fileNameIndex = filename.lastIndexOf('.');
        //                 let _fileName = filename.substring(0, _fileNameIndex) + '_' + cauLacBo_Id;
        //                 let _fileType = filename.substring(_fileNameIndex);
        //                 let url_Anh = '/CauLacBo/' + _fileName + _fileType;

        //                 //save file to directory
        //                 await saveFile([args.bodyData.anh], 'CauLacBo', _fileName + _fileType);
        //                 await trx.table('CauLacBo').where('Id', cauLacBo_Id).update({ Anh_Url: url_Anh });
        //             }
        //             return {
        //                 messageCode: 200,
        //                 message: 'Cập nhật câu lạc bộ thành công!',
        //             }
        //         });
        //         return trx_result;
        //     }
        //     catch (err) {
        //         logging(context, err);
        //         return {
        //             messageCode: 500,
        //             message: err.toString(),
        //         }
        //     }
        // }),
        // DeleteCauLacBo: authenticated(async (parent, args, context) => {
        //     try {
        //         let Id = args.Id
        //         let cauLacBo = await db.table('CauLacBo').where('Id', Id)
        //         if (cauLacBo.length == 0) {
        //             return {
        //                 messageCode: 404,
        //                 message: 'Không tìm thấy câu lạc bộ!',
        //             }
        //         }
        //         let trx_result = await db.transaction(async trx => {
        //             let cauLacBo_HocSinh = await trx.table('CauLacBo_HocSinh').where('CauLacBo_Id', Id)
        //             if (cauLacBo_HocSinh) {
        //                 await trx.table('CauLacBo_HocSinh').where('CauLacBo_Id', Id).del()
        //             }

        //             let cauLacBo_Lich_HS = await trx.table('CauLacBo_Lich_HocSinh').where('CauLacBo_Id', Id)
        //             if (cauLacBo_Lich_HS) {
        //                 await trx.table('CauLacBo_Lich_HocSinh').where('CauLacBo_Id', Id).del()
        //             }

        //             let cauLacBo_Lich = await trx.table('CauLacBo_Lich').where('CauLacBo_Id', Id)
        //             if (cauLacBo_Lich) {
        //                 await trx.table('CauLacBo_Lich').where('CauLacBo_Id', Id).del()
        //             }
        //             await trx.table('CauLacBo').where('Id', Id).del()

        //             return {
        //                 messageCode: 200,
        //                 message: 'Xóa câu lạc thành công!',
        //             }
        //         })
        //         return trx_result;
        //     }
        //     catch (err) {
        //         logging(context, err);
        //         return {
        //             messageCode: 500,
        //             message: err.toString(),
        //         }
        //     }
        // }),
    }
}
module.exports = resolver