export interface Nutrient{
    CA: number,
    CHOCDF: number,
    CHOLE: number,
    ENERC_KCAL: number,
    FAMS: number,
    FAPU: number,
    FASAT: number,
    FAT: number, 
    FE: number,
    FIBTG: number,
    FOLAC: number,
    FOLDFE: number,
    FOLFD: number,
    K: number,
    MG: number,
    NA: number,
    NIA: number,
    P: number,
    PROCNT: number,
    RIBF: number,
    SUGAR: number,
    THIA: number,
    TOCPHA: number,
    VITA_RAE: number,
    VITB6A: number,
    VITB12: number,
    VITC: number,
    VITD: number,
    VITK1: number,
    WATER: number,
    ZN: number,
}

let list = {
    total : {
        CA: {value:0, unit : "mg"},
        CHOCDF: {value:0, unit: "g"},
        CHOLE: {value:0, unit: "mg"},
        ENERC_KCAL: {value:0, unit: "kcal"},
        FAMS: {value:0, unit: "g"},
        FAPU: {value:0, unit: "g"},
        FASAT: {value:0, unit: "g"},
        FAT: {value:0, unit: "g"},
        FE: {value:0, unit: "mg"},
        FIBTG: {value:0, unit: "g"},
        FOLAC: {value:0, unit: "ug"},
        FOLDFE:{value:0, unit: "ug"},
        FOLFD:{value:0, unit: "ug"},
        K: {value: 0, unit: "mg"},
        MG: {value: 0, unit: "mg"},
        NA: {value: 0, unit: "mg"},
        NIA: {value: 0, unit: "mg"},
        P: {value: 0, unit: "mg"},
        PROCNT: {value: 0, unit: "g"},
        RIBF: {value: 0, unit: "mg"},
        SUGAR: {value: 0, unit: "g"},
        THIA: {value: 0, unit: "mg"},
        TOCPHA: {value: 0, unit: "mg"},
        VITA_RAE: {value: 0, unit: "ug"},
        VITB6A: {value: 0, unit: "mg"},
        VITB12: {value: 0, unit: "ug"},
        VITC: {value: 0, unit: "mg"},
        VITD: {value: 0, unit: "ug"},
        VITK1: {value: 0, unit: "ug"},
        WATER: {value: 0, unit: "g"},
        ZN: {value: 0, unit: "mg"},
    },
    food : new Array()
}

let count: number = 0;

const edamamConfig = {
    api_id: process.env.REACT_APP_nutritionAnalysisId,
    api_key: process.env.REACT_APP_nutritionAnalysisKey
};

export async function getNutrientEach(ingredient: string){
    const response = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${edamamConfig.api_id}&app_key=${edamamConfig.api_key}&nutrition-type=cooking&ingr=${ingredient}`,{
        method : "GET"
    });
    const nutrient = await response.json();
    let myObj = {
        name : ingredient,
        nutrient : {
            CA: {value:0, unit : "mg"},
            CHOCDF: {value:0, unit: "g"},
            CHOLE: {value:0, unit: "mg"},
            ENERC_KCAL: {value:0, unit: "kcal"},
            FAMS: {value:0, unit: "g"},
            FAPU: {value:0, unit: "g"},
            FASAT: {value:0, unit: "g"},
            FAT: {value:0, unit: "g"},
            FE: {value:0, unit: "mg"},
            FIBTG: {value:0, unit: "g"},
            FOLAC: {value:0, unit: "ug"},
            FOLDFE:{value:0, unit: "ug"},
            FOLFD:{value:0, unit: "ug"},
            K: {value: 0, unit: "mg"},
            MG: {value: 0, unit: "mg"},
            NA: {value: 0, unit: "mg"},
            NIA: {value: 0, unit: "mg"},
            P: {value: 0, unit: "mg"},
            PROCNT: {value: 0, unit: "g"},
            RIBF: {value: 0, unit: "mg"},
            SUGAR: {value: 0, unit: "g"},
            THIA: {value: 0, unit: "mg"},
            TOCPHA: {value: 0, unit: "mg"},
            VITA_RAE: {value: 0, unit: "ug"},
            VITB6A: {value: 0, unit: "mg"},
            VITB12: {value: 0, unit: "ug"},
            VITC: {value: 0, unit: "mg"},
            VITD: {value: 0, unit: "ug"},
            VITK1: {value: 0, unit: "ug"},
            WATER: {value: 0, unit: "g"},
            ZN: {value: 0, unit: "mg"},
        }
    }
    myObj.nutrient.CA.value += nutrient.totalNutrients.CA.quantity;
    list.total.CA.value += myObj.nutrient.CA.value;
    myObj.nutrient.CHOCDF.value += nutrient.totalNutrients.CHOCDF.quantity;
    list.total.CHOCDF.value += myObj.nutrient.CHOCDF.value;
    myObj.nutrient.CHOLE.value += nutrient.totalNutrients.CHOLE.quantity;
    list.total.CHOLE.value += myObj.nutrient.CHOLE.value;
    myObj.nutrient.ENERC_KCAL.value += nutrient.totalNutrients.ENERC_KCAL.quantity;
    list.total.ENERC_KCAL.value += myObj.nutrient.ENERC_KCAL.value;
    myObj.nutrient.FAMS.value += nutrient.totalNutrients.FAMS.quantity;
    list.total.FAMS.value += myObj.nutrient.FAMS.value;
    myObj.nutrient.FAPU.value += nutrient.totalNutrients.FAPU.quantity;
    list.total.FAPU.value += myObj.nutrient.FAPU.value;
    myObj.nutrient.FASAT.value += nutrient.totalNutrients.FASAT.quantity;
    list.total.FASAT.value += myObj.nutrient.FASAT.value;
    myObj.nutrient.FAT.value += nutrient.totalNutrients.FAT.quantity;
    list.total.FAT.value += myObj.nutrient.FAT.value;
    myObj.nutrient.FE.value += nutrient.totalNutrients.FE.quantity;
    list.total.FE.value += myObj.nutrient.FE.value;
    myObj.nutrient.FIBTG.value += nutrient.totalNutrients.FIBTG.quantity;
    list.total.FIBTG.value += myObj.nutrient.FIBTG.value;
    myObj.nutrient.FOLAC.value += nutrient.totalNutrients.FOLAC.quantity;
    list.total.FOLAC.value += myObj.nutrient.FOLAC.value;
    myObj.nutrient.FOLDFE.value += nutrient.totalNutrients.FOLDFE.quantity;
    list.total.FOLDFE.value += myObj.nutrient.FOLDFE.value;
    myObj.nutrient.FOLFD.value += nutrient.totalNutrients.FOLFD.quantity;
    list.total.FOLFD.value += myObj.nutrient.FOLFD.value;
    myObj.nutrient.K.value += nutrient.totalNutrients.K.quantity;
    list.total.K.value += myObj.nutrient.K.value;
    myObj.nutrient.MG.value += nutrient.totalNutrients.MG.quantity;
    list.total.MG.value += myObj.nutrient.MG.value;
    myObj.nutrient.NA.value += nutrient.totalNutrients.NA.quantity;
    list.total.NA.value += myObj.nutrient.NA.value;
    myObj.nutrient.NIA.value += nutrient.totalNutrients.NIA.quantity;
    list.total.NIA.value += myObj.nutrient.NIA.value;
    myObj.nutrient.P.value += nutrient.totalNutrients.P.quantity;
    list.total.P.value += myObj.nutrient.P.value;
    myObj.nutrient.PROCNT.value += nutrient.totalNutrients.PROCNT.quantity;
    list.total.PROCNT.value += myObj.nutrient.PROCNT.value;
    myObj.nutrient.RIBF.value += nutrient.totalNutrients.RIBF.quantity;
    list.total.RIBF.value += myObj.nutrient.RIBF.value;
    myObj.nutrient.SUGAR.value += nutrient.totalNutrients.SUGAR.quantity;
    list.total.SUGAR.value += myObj.nutrient.SUGAR.value;
    myObj.nutrient.THIA.value += nutrient.totalNutrients.THIA.quantity;
    list.total.THIA.value += myObj.nutrient.THIA.value;
    myObj.nutrient.TOCPHA.value += nutrient.totalNutrients.TOCPHA.quantity;
    list.total.TOCPHA.value += myObj.nutrient.TOCPHA.value;
    myObj.nutrient.VITA_RAE.value += nutrient.totalNutrients.VITA_RAE.quantity;
    list.total.VITA_RAE.value += myObj.nutrient.VITA_RAE.value;
    myObj.nutrient.VITB6A.value += nutrient.totalNutrients.VITB6A.quantity;
    list.total.VITB6A.value += myObj.nutrient.VITB6A.value;
    myObj.nutrient.VITB12.value += nutrient.totalNutrients.VITB12.quantity;
    list.total.VITB12.value += myObj.nutrient.VITB12.value;
    myObj.nutrient.VITC.value += nutrient.totalNutrients.VITC.quantity;
    list.total.VITC.value += myObj.nutrient.VITC.value;
    myObj.nutrient.VITD.value += nutrient.totalNutrients.VITD.quantity;
    list.total.VITD.value += myObj.nutrient.VITD.value;
    myObj.nutrient.VITK1.value += nutrient.totalNutrients.VITK1.quantity;
    list.total.VITK1.value += myObj.nutrient.VITK1.value;
    myObj.nutrient.WATER.value += nutrient.totalNutrients.WATER.quantity;
    list.total.WATER.value += myObj.nutrient.WATER.value;
    myObj.nutrient.ZN.value += nutrient.totalNutrients.ZN.quantity;
    list.total.ZN.value += myObj.nutrient.ZN.value;
    list.food[count++] = myObj;
    return nutrient;
}

export function getNutrient(input: string){
    const arr = seperateFood(input);
    for (let i=0; i<arr.length; i++){
        getNutrientEach(arr[i]);
    }
    console.log(list);
}
function seperateFood(input: string){
    return input.split(",");
}
