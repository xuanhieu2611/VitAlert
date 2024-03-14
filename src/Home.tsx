import React, { useEffect, useRef, useState } from "react";
import { Auth, User } from "firebase/auth";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Firestore } from "firebase/firestore";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import logo from "./images/VitAlert-Logo.png";
import {
	Box,
	Button,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Paper,
	Stack,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { SignInRequired, useRequiredSignIn } from "./UseSignIn";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import Avatar from "@mui/material/Avatar";
import { FoodNutrientMap, NutrientProfile, combineFoodNutrientMaps, getNutrientCommonName, getNutrientValues, getSymptomData, removeNutrient, sortByDailyValue, sumNutrients } from "./FoodParsing";
import { AdsClick, BakeryDining, Cake, Delete, DeleteTwoTone, Egg, Fastfood, Icecream, Info, LocalPizza, RamenDining } from "@mui/icons-material";
import { fetchOrCreate, save } from "./FirebaseUtils";
import { theme } from "./App";

type FoodResponseType = {
	total: NutrientProfile,
	foods: FoodNutrientMap
};

export const Home = (props: { auth: Auth; firestore: Firestore }) => {
	const user = useRequiredSignIn(props.auth);

	return (
		<>
			<SignInRequired auth={props.auth} user={user}>
				<HomeSignedIn {...props} user={user!!} />
			</SignInRequired>
		</>
	);
};

const HomeSignedIn = (props: {
	auth: Auth;
	user: User;
	firestore: Firestore;
}) => {
	const navigate = useNavigate();
	const [foodInput, setFoodInput] = useState("");
	const [foods, setFoods] = useState<null | FoodResponseType>(null);
	const aboveMd = useMediaQuery(theme.breakpoints.up('md'));

	useEffect(() => {
		(async () => {
			const val = await fetchOrCreate<FoodResponseType>(props.firestore, "/userdata", props.user.uid, () => ({
				total: new Map(),
				foods: new Map()
			}));
			setFoods(val);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (foods !== null)
				await save(props.firestore, "/userdata", props.user.uid, foods);
		})();
	}, [foods]);

	return (
		<>
			<Grid
				container
				spacing={1}
				px={4}
				justifyContent={"center"}
				alignItems={'flex-start'}
			>
				<Grid item xs={12} textAlign="center">
					<Stack
						direction="row"
						spacing={4}
						alignItems={'center'}
						justifyContent="space-around">
						{aboveMd &&
							<Box
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}>
								<Typography sx={{
									fontSize: '0.6em'
								}}>
									Welcome, {props.user.displayName}!
								</Typography>
							</Box>}
						<Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
							<Avatar alt="Vitalert Logo" src={logo} sx={{
								width: 65, height: 65
							}} />
							<h1>
								<span style={{ color: "#007c00" }}>Vit</span>
								<span style={{ color: "#F9145b" }}>Alert</span>
							</h1>
						</Stack>
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}>
							<Button onClick={() => signOut(props.auth, navigate)}>
								Sign Out
							</Button>
						</Box>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Stack
						direction="row"
						spacing={2}
						alignItems={"center"}
						justifyContent={"center"}>
						<Stack>
							<Avatar>
								<LunchDiningIcon></LunchDiningIcon>
							</Avatar>
						</Stack>
						<TextField
							onKeyDown={e => {
								if (e.keyCode === 13)
									parseFoodInput(props.firestore, props.user, foodInput, setFoodInput, foods, setFoods)
							}}
							variant="filled"
							value={foodInput}
							placeholder="1 apple, 1 slice pizza, 1 cup rice"
							onChange={(e) => setFoodInput(e.currentTarget.value)}
							label={<span style={{ color: 'white' }}>Type <span style={{ color: "#007c00" }}>food</span> and <span style={{ color: "#F9145b" }}>amount . . .</span></span>}
							sx={{
								width: "75%",
							}}
						></TextField>
						<Button
							disabled={foodInput == ""}
							variant="contained"
							onClick={() =>
								parseFoodInput(props.firestore, props.user, foodInput, setFoodInput, foods, setFoods)
							}>
							Submit
						</Button>
					</Stack>
				</Grid>
				<Grid item xs={12} lg={6}>
					<YourFoods foods={foods} setFoods={setFoods} />
				</Grid>
				<Grid item xs={12} lg={6}>
					<MissingNutrients foods={foods} />
				</Grid>
				<Grid item xs={12} paddingTop={4} textAlign={'center'}>
					Copyright © 2024 Callum Mackenzie, Fegico Chen, Terence Yin, Hieu Le
				</Grid>
			</Grid>
		</>
	);
};

const YourFoods = (props: {
	foods: FoodResponseType | null,
	setFoods: (f: FoodResponseType | null) => void,
}) => {
	interface Row {
		id: string,
		measure: string,
		quantity: number,
		key: number,
		nutrients: string
	}

	const [currentPopup, setCurrentPopup] = useState<number>(-1);
	const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
	const handleClickForPopup = (event: React.MouseEvent<HTMLElement>) => {
		setAnchor(anchor ? null : event.currentTarget);
	};
	const [rows, setRows] = useState<Array<Row>>([]);

	useEffect(() => {
		if (props.foods === null)
			return setRows([]);
		let uid = 0;
		const r = Array.from(props.foods.foods)
			.map(set => {
				const key = set[0], value = set[1];
				return ({
					id: key,
					key: uid++,
					measure: value.measure,
					quantity: value.quantity,
					nutrients: Array.from(value.nutrients)
						.reduce((acc, [k, curr]) => acc + " " + Number(curr.quantity.toPrecision(1))
							+ " " + curr.unit + " " + getNutrientCommonName(k) + ", ", "")
				});
			});
		setRows(r);
	}, [props.foods]);

	const aboveXl = useMediaQuery(theme.breakpoints.up('xl')),
		aboveLg = useMediaQuery(theme.breakpoints.up('lg')),
		aboveMd = useMediaQuery(theme.breakpoints.up('md')),
		aboveSm = useMediaQuery(theme.breakpoints.up('sm')),
		aboveXs = useMediaQuery(theme.breakpoints.up('xs'));

	return (
		<>
			<Paper>
				<Grid container px={3} paddingBottom={1} alignItems={'flex-start'}>
					<Grid item xs={12}>
						<Stack direction={'row'} alignItems={'center'} justifyContent={'space-around'}>
							<h2 style={{
								color: "#007c00"
							}}>Your foods . . .</h2>
							{Array.from(Array(aboveXl ? 7 : aboveLg ? 5 : aboveMd ? 4 : aboveSm ? 3 : 2).keys()).map(i => (<>
								<Avatar>
									{[<Icecream />, <Cake />, <Fastfood />, <LocalPizza />, <RamenDining />,
									<BakeryDining />, <Egg />][i]}
								</Avatar>
							</>))}
						</Stack>
					</Grid>
					<Grid item xs={12} paddingBottom={2} >
						<Divider />
					</Grid>
					<Grid item xs={12}>
						<List sx={{
							overflowY: 'scroll',
							height: '45vh'
						}}>
							{rows.map(row => {
								return (<>
									<ListItem
										key={row.key}
										secondaryAction={
											<React.Fragment>
												<BasePopup open={currentPopup == row.key} anchor={anchor}>
													<Paper sx={{
														maxWidth: "75vw",
														background: "#2b2727"
													}}>
														<Box px={1}>
															<h3>{row.id}</h3>
															<p>{row.nutrients}</p>
														</Box>
													</Paper>
												</BasePopup>
												<IconButton onClick={e => {
													handleClickForPopup(e);
													if (currentPopup != row.key)
														setCurrentPopup(row.key);
													else setCurrentPopup(-1);
												}}>
													<Info sx={{ color: 'white' }} />
												</IconButton>
												<IconButton edge="end" aria-label="delete"
													onClick={() => {
														if (props.foods === null)
															return;
														const newNutrientList = removeNutrient(props.foods?.foods, row.id);
														const newTotal = sumNutrients(Array.from(newNutrientList.values()).map(x => x.nutrients));
														props.setFoods({
															total: newTotal, foods: newNutrientList
														});
													}}>
													<Delete sx={{
														color: 'white'
													}} />
												</IconButton>
											</React.Fragment>
										}>
										<ListItemText key={row.key}>
											{row.id} {row.quantity}
										</ListItemText>
									</ListItem>
								</>);
							})}
						</List>
					</Grid>
				</Grid>
			</Paper >
		</>
	);
};

const MissingNutrients = (props: {
	foods: FoodResponseType | null,
}) => {
	const navigate = useNavigate();

	interface Row {
		id: string,
		key: number,
		percentDaily: number,
		value: number,
		unit: string
	}

	const [rows, setRows] = useState<Array<Row>>([]);

	useEffect(() => {
		if (props.foods == null)
			return setRows([]);
		let uid = 0;
		const belowVal = sortByDailyValue(props.foods.total).map(x => ({
			id: getNutrientCommonName(x[0]),
			percentDaily: Number(x[1].percentDaily?.toPrecision(3)),
			value: Number(x[1].quantity.toPrecision(3)),
			unit: x[1].unit,
			key: uid++,
		})).filter(x => !isNaN(x.value) && !isNaN(x.percentDaily));
		setRows(belowVal);
	}, [props.foods]);

	return (<>
		<Paper>
			<Grid container px={3} paddingBottom={1}>
				<Grid item xs={12}>
					<h2 style={{
						color: "#F9145b"
					}}>You may be deficient in . . .</h2>
				</Grid>
				<Grid item xs={12} paddingBottom={2}>
					<Divider />
				</Grid>
				<Grid
					item xs={12}>
					<List sx={{
						overflowY: 'scroll',
						height: '45vh'
					}}>
						{rows.map(row => {
							return (<>
								<ListItem
									key={row.key}
									secondaryAction={
										<Tooltip title={"Information on " + row.id}>
											<ListItemButton key={row.key}
												disabled={getSymptomData(row.id) === undefined}
												onClick={() => {
													navigate(`/nutrient?nutrient=${row.id}`);
												}}>
												<AdsClick />
											</ListItemButton>
										</Tooltip>
									}>
									<ListItemText key={row.key}
										secondary={
											<React.Fragment>
												{getSymptomData(row.id)?.symptoms}
											</React.Fragment>
										}>
										{row.id} {row.value} {row.unit}, daily intake: {row.percentDaily}%
									</ListItemText>
								</ListItem >
							</>);
						})}
					</List>
				</Grid>
			</Grid>
		</Paper >
	</>);
};

const signOut = (auth: Auth, navigate: NavigateFunction) => {
	auth.signOut();
	navigate("/");
};

const parseFoodInput = async (firestore: Firestore,
	user: User,
	input: string,
	setInput: (s: string) => void,
	foods: FoodResponseType | null,
	setFoods: (f: FoodResponseType | null) => void) => {
	setInput("");
	let foodValues = await getNutrientValues(input);
	if (foods !== null)
		foodValues = combineFoodNutrientMaps(foods.foods, foodValues);
	const totals = sumNutrients(Array.from(foodValues.values()).map(v => v.nutrients));
	setFoods({
		total: totals,
		foods: foodValues
	});
};
