import multer from "multer";
import fs from "fs"
import path from "path";


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const uploadPath = "D:/jungle_boosh";
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath,{recursive:true})
        }

        cb(null,uploadPath)
    },

    filename:(req,file,cb)=>{
        const customFilename = file.originalname.split(".")[0];
        cb(null,`${customFilename}${path.extname(file.originalname)}`)
    },
});

const upload = multer({storage});

export default upload