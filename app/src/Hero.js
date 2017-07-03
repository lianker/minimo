export default class Hero{
    constructor(name, power, createdDate){
        this._name = name;
        this._power = power;
        this._createddate = new Date(createdDate.getTime());
        Object.freeze();
    }

    get name(){
        return this._name;
    }

    get power(){
        return this._power;
    }

    get createdDate(){
        return new Date(this._createddate.getTime());
    }
}