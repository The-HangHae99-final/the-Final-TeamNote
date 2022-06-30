const mongoose = require('mongoose');
const MypageSchema = new mongoose.Schema({
    userid: {
        type: String,//토큰 받아서 유저아이디만 필요하므로 똑같이 정함. 
    },//배열형태여야 채용정보 객체 담아지므로 배열형태로 정했음.
    markList: {
        type: Array 
    }
});
module.exports = mongoose.model('mypage', MypageSchema);
