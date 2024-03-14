import React, { useEffect } from "react";
import symptomsJson from "./data/symptoms2.json";

export type NutrientProfile = Map<Nutrient, UnitValue>;
export type FoodNutrientMap = Map<string, FoodInfo>;

export interface FoodInfo {
	name: string,
	quantity: number,
	measure: string,
	nutrients: NutrientProfile,
}

export interface UnitValue {
	unit: string,
	label: string,
	quantity: number,
	percentDaily: number | undefined,
};

export enum Nutrient {
	Calories = "ENERC_KCAL",
	Fat = "FAT",
	SaturatedFat = "FASAT",
	MonosaturatedFat = "FAMS",
	PolyunsaturatedFat = "FAPU",
	Carbohydrate = "CHOCDF",
	NetCarbohydrate = "CHOCDF.net",
	Fiber = "FIBTG",
	Sugar = "SUGAR",
	Protein = "PROCNT",
	Cholesterol = "CHOLE",
	Sodium = "NA",
	Calcium = "CA",
	Magnesium = "MG",
	Potassium = "K",
	Iron = "FE",
	Zinc = "ZN",
	Phosphorus = "P",
	VitaminA = "VITA_RAE",
	VitaminC = "VITC",
	Thiamin = "THIA",
	Riboflavin = "RIBF",
	Niacin = "NIA",
	VitaminB6 = "VITB6A",
	FolateTotal = "FOLDFE",
	FolateFood = "FOLFD",
	FolicAcid = "FOLAC",
	VitaminB12 = "VITB12",
	VitaminD = "VITD",
	VitaminE = "TOCPHA",
	VitaminK = "VITK1",
	Water = "WATER",
}

const nutrientNameList: Map<string, string[]> = new Map([
	["Calories", ["Calories"]],
	["Fat", ["Fat"]],
	["SaturatedFat", ["Saturated Fat"]],
	["MonosaturatedFat", ["Monosaturated Fat"]],
	["PolyunsaturatedFat", ["Polyunsaturated Fat"]],
	["Carbohydrate", ["Carbohydrate"]],
	["NetCarbohydrate", ["Net Carbohydrate"]],
	["Fiber", ["Fiber"]],
	["Sugar", ["Sugar"]],
	["Protein", ["Protein"]],
	["Cholesterol", ["Cholesterol"]],
	["Sodium", ["Sodium"]],
	["Calcium", ["Calcium"]],
	["Magnesium", ["Magnesium"]],
	["Potassium", ["Potassium"]],
	["Iron", ["Iron"]],
	["Zinc", ["Zinc"]],
	["Phosphorus", ["Phosphorus"]],
	["VitaminA", ["Vitamin A"]],
	["VitaminC", ["Vitamin C"]],
	["Thiamin", ["Thiamin"]],
	["Riboflavin", ["Riboflavin"]],
	["Niacin", ["Niacin"]],
	["VitaminB6", ["Vitamin B6"]],
	["FolateTotal", ["Folate (Total)"]],
	["FolateFood", ["Folate (Food)"]],
	["FolicAcid", ["Folic Acid"]],
	["VitaminB12", ["Vitamin B12"]],
	["VitaminD", ["Vitamin D"]],
	["VitaminE", ["Vitamin E"]],
	["VitaminK", ["Vitamin K"]],
	["Water", ["Water"]],
]);

export const getNutrientCommonName = (n: Nutrient): string => {
	const names = nutrientNameList.get(n);
	return names === undefined ? "" : names[0];
};

const edamamConfig = {
	api_id: process.env.REACT_APP_nutritionAnalysisId,
	api_key: process.env.REACT_APP_nutritionAnalysisKey
};

export const getNutrientValues = async (input: string): Promise<FoodNutrientMap> => {
	const nutrients = input.split(/\s*,\s*/gm).filter(v => v.length != 0);
	const responses: FoodNutrientMap = new Map();
	// This could be faster but I want to save time
	for (let i = 0; i < nutrients.length; ++i) {
		const n = nutrients[i];
		const response = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${edamamConfig.api_id}&app_key=${edamamConfig.api_key}&nutrition-type=cooking&ingr=${n}`, {
			method: "GET"
		});
		if (!response.ok) {
			console.error("Not found: " + n);
			continue;
		}
		const foodNutrients: NutrientProfile = new Map();
		const json = await response.json();
		if (Object.entries(json["totalNutrients"]).length === 0) {
			console.error("Malformed request for: " + n);
			continue;
		}
		Object.entries(Nutrient)
			.forEach(v => {
				const nutrientUnitValue = json["totalNutrients"][v[1]] as UnitValue | undefined;
				if (nutrientUnitValue !== undefined) {
					const totalDaily = json["totalDaily"][v[1]];
					const quantity = nutrientUnitValue.quantity;
					if (totalDaily === undefined) {
						nutrientUnitValue.percentDaily = {
							[Nutrient.MonosaturatedFat]: quantity / 30 * 100,
							[Nutrient.PolyunsaturatedFat]: quantity / 11 * 100,
							[Nutrient.Cholesterol]: quantity / 150 * 100,
							[Nutrient.Carbohydrate]: quantity / 210 * 100,
							[Nutrient.VitaminD]: quantity / 15 * 100,
							[Nutrient.Sodium]: quantity / 2300 * 100,
							[Nutrient.Protein]: quantity / 55 * 100,
							[Nutrient.Calcium]: quantity / 1200 * 100,
							[Nutrient.Magnesium]: quantity / 410 * 100,
							[Nutrient.Potassium]: quantity / 2800 * 100,
							[Nutrient.Thiamin]: quantity / 1.15 * 100,
							[Nutrient.Riboflavin]: quantity / 1.2 * 100,
							[Nutrient.Fat]: quantity / 40 * 100,
							[Nutrient.Calories]: quantity / 2200 * 100,
							[Nutrient.SaturatedFat]: quantity / 15 * 100,
							[Nutrient.Iron]: quantity / 11 * 100,
							[Nutrient.Fiber]: quantity / 25 * 100,
							[Nutrient.Niacin]: quantity / 15 * 100,
							[Nutrient.VitaminE]: quantity / 15 * 100,
							[Nutrient.VitaminB12]: quantity / 2.4 * 100,
							[Nutrient.VitaminB6]: quantity / 1.6 * 100,
							[Nutrient.VitaminC]: quantity / 82 * 100,
							[Nutrient.Zinc]: quantity / 10 * 100,
							[Nutrient.VitaminK]: quantity / 70 * 100,
							[Nutrient.Phosphorus]: quantity / 1200 * 100,
							[Nutrient.Sugar]: quantity / 30 * 100,
							[Nutrient.NetCarbohydrate]: quantity / 190 * 100,
							[Nutrient.FolateTotal]: quantity / 400 * 100,
							[Nutrient.FolateFood]: NaN,
							[Nutrient.FolicAcid]: NaN
						}[v[1] as string];
					}
					else
						nutrientUnitValue.percentDaily = totalDaily["quantity"];
					foodNutrients.set(v[0] as Nutrient, nutrientUnitValue);
				} else
					foodNutrients.set(v[0] as Nutrient, {
						percentDaily: 0,
						quantity: 0,
						unit: "g",
						label: v[0] as string,
					});
			});
		const parsedJson = json["ingredients"][0]["parsed"][0];
		const foodName = parsedJson["foodMatch"];
		const foodQuantity = parsedJson["quantity"];
		const foodMeasure = parsedJson["measure"];
		const foodInfo: FoodInfo = {
			name: foodName,
			quantity: foodQuantity,
			measure: foodMeasure,
			nutrients: foodNutrients
		};
		responses.set(foodName + " (" + foodMeasure + ")", foodInfo);
	}
	return responses;
}

export const sumNutrients = (input: Array<NutrientProfile>): NutrientProfile => {
	const sum: NutrientProfile = new Map();
	input.forEach(profile => {
		Array.from(profile).forEach(([key, value]) => {
			const prevValue = sum.get(key);
			if (prevValue !== undefined && prevValue.unit !== value.unit)
				console.error("UNIT MISMATCH: " + JSON.stringify(prevValue) + JSON.stringify(value));
			sum.set(key, prevValue === undefined ? {
				unit: value.unit,
				quantity: value.quantity,
				label: value.label,
				percentDaily: value.percentDaily
			} : {
				unit: prevValue.unit,
				quantity: prevValue.quantity + value.quantity,
				label: prevValue.label,
				percentDaily: (prevValue.percentDaily === undefined && value.percentDaily === undefined) ?
					undefined : ((prevValue.percentDaily ?? 0) + (value.percentDaily ?? 0))
			});
		});
	});
	return sum;
}

export const removeNutrient = (a: FoodNutrientMap, toRemove: string): FoodNutrientMap => {
	const ret = new Map();
	Array.from(a).forEach(([key, value]) => {
		if (key != toRemove)
			ret.set(key, value);
	});
	return ret;
};

export const combineFoodNutrientMaps = (a: FoodNutrientMap, b: FoodNutrientMap): FoodNutrientMap => {
	const ret: FoodNutrientMap = new Map();
	Array.from(a).forEach(([key, value]) => {
		ret.set(key, value);
	});
	b.forEach((value, key) => {
		const prevVal = ret.get(key);
		if (prevVal !== undefined)
			ret.set(key, {
				nutrients: sumNutrients([prevVal.nutrients, value.nutrients]),
				name: prevVal.name,
				measure: prevVal.measure,
				quantity: prevVal.quantity + value.quantity
			});
		else
			ret.set(key, value);
	});
	return ret;
}

export const sortByDailyValue = (total: NutrientProfile): Array<[Nutrient, UnitValue]> => {
	let low: Array<[Nutrient, UnitValue]> = [];
	Array.from(total).forEach(([key, value]) => {
		low.push([key, value]);
	});
	const ret = low.sort((a, b) => (a[1].percentDaily ?? 1.1) - (b[1].percentDaily ?? 1.1));
	return ret;
};

export interface DeficiencyData {
	name: string,
	rarity: string,
	func: string,
	sources: string,
	symptoms: string,
}

export const getSymptomData = (name: string): DeficiencyData | undefined => {
	let index = -1;
	for (let i = 0; i < symptomsJson.Name.length; i++) {
		if ((symptomsJson.Name[i] as string).toLowerCase().trim()
			== name.toLowerCase().trim().replaceAll(/\s+/gm, " ")) {
			index = i;
			break;
		}
	}
	if (index == -1)
		return undefined;
	return {
		name: symptomsJson.Name[index],
		rarity: symptomsJson.Rarity[index],
		func: symptomsJson.Function[index],
		sources: symptomsJson.Sources[index],
		symptoms: symptomsJson.Symptoms[index]
	};
};