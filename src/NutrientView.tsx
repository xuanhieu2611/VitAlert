import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
	Backdrop,
	Box,
	Button,
	Container,
	Divider,
	Grid,
	List,
	ListItem,
	Paper,
	Stack,
	TextField,
	Card,
	CardContent,
	Typography,
	ImageList,
	ImageListItem,
	useMediaQuery,
	bottomNavigationActionClasses
} from "@mui/material";

import symptomsJson from "./data/symptoms2.json";

import foodJson from "./data/foodImage.json";
import { getSymptomData } from "./FoodParsing";
import { theme } from "./App";

// https://vitalert.com?nutrient="Vitamin A"
// http://localhost:3000/nutrient?nutrient=%22Vitamin%20A%22
// nutrient = "Vitamin A"
// Find index of Vitamin A in json
// Get the data for the other fields (function, symptoms)
// Put them in UI nicely

export const NutrientView = (props: {
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const nutrient = queryParams.get('nutrient');

	const aboveXl = useMediaQuery(theme.breakpoints.up('xl')),
		aboveLg = useMediaQuery(theme.breakpoints.up('lg')),
		aboveMd = useMediaQuery(theme.breakpoints.up('md')),
		aboveSm = useMediaQuery(theme.breakpoints.up('sm')),
		aboveXs = useMediaQuery(theme.breakpoints.up('xs'));

	// console.log(nutrient);

	// nutrient is the value of the nutrient query parameter
	// const { nutrient } = useParams();



	// const nutrient = "ALPHA LIPOIC ACID";
	//const nutrient = "VITAMIN A";
	const data = getSymptomData(nutrient ?? "");
	if (data === undefined)
		return (<>
			<Stack spacing='2' direction={'column'} alignItems={'center'}>
				<h2>Not found: {nutrient}!</h2>
				<Button onClick={() => navigate("/home")}>Home</Button>
			</Stack>
		</>);
	const { name, rarity, func, sources, symptoms } = data;
	let itemData: any = [];
	let sourceList = sources.split(",");
	sourceList = sourceList.map((data) => (data.trim().toLowerCase()));
	sourceList.forEach((item) => {
		if (Object.hasOwn(foodJson, item)) {
			itemData.push(foodJson[item as keyof typeof foodJson]);
		}
	})
	let colorString: string;

	if (rarity === "MOST COMMON") {
		colorString = "green";
	} else if (rarity === "VERY COMMON") {
		colorString = "cyan";
	} else if (rarity === "COMMON") {
		colorString = "orange";
	} else if (rarity === "LESS COMMON") {
		colorString = "yellow";
	}
	else {
		colorString = "red";
	}
	let i = 0;

	return (
		<>
			<Box
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}>
				<Stack direction="column" alignItems='center' justifyContent='center' p={3}>
					<Box textAlign={'center'}>
						<h1>{nutrient?.split(/\s+/gm).map(x => <span style={{ color: i++ % 2 == 0 ? "#007c00" : "#F9145b" }}>{x} </span>)}</h1>
						<Divider />
						<h2 style={{ color: colorString }}>Deficiency rarity: {rarity.toLocaleLowerCase()}</h2>
						<Divider />
						<h2>Symptoms</h2>
						<p>{symptoms}</p>
						<Divider />
						<h2>Foods with {nutrient}</h2>
						<p>{sources}</p>
						<Divider />
						<h2>Functions of {nutrient} in the Body</h2>
						<p>{func}</p>
						<Divider />
					</Box>

					<ImageList variant="masonry"
						sx={{
							width: aboveXl ? 1000 : aboveLg ? 850 : aboveMd ? 650 : aboveSm ? 450 : 275,
						}}
						cols={2} rowHeight={164}>
						{itemData.map((item: any) => (
							<ImageListItem key={item}>
								<img
									srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
									src={`${item}?w=164&h=164&fit=crop&auto=format`}
									loading="lazy"
								/>
							</ImageListItem>
						))}
					</ImageList>
					<Button
						onClick={() => navigate("/home")}
						variant='contained'>
						Home
					</Button>
				</Stack>
			</Box >
		</>
	);
};
