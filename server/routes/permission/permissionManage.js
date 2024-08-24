const { log } = require("debug/src/node");
const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions:{type:String,required:true}
});

const permission = mongoose.model("permission", permissionSchema);

function addPermission(name,permissions) {
    permission.findOne({ name }).then(res=>{
        if(res===null){
            permission.create({name,permissions})
        }
        else {
            permission.updateOne({name},{permissions}).exec()
        }
    })
};

module.exports = {addPermission}

