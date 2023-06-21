const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
    title:{
        type: String,
        required: true
    },
    notes:{
        type: String
    },
    start:{
        type: Date,
        required: true
    },
    end:{
        type: Date,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true

    }
    
})

//*Con este codigo lo que hacemos es serializar el JSON de la forma que mas nos guste. En este caso sacamos el __v y al _id lo cambiamos solo por id. Esto modifica la DB
EventoSchema.method('toJSON', function(){
    const {__v, _id, ...object } =  this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Evento',EventoSchema);