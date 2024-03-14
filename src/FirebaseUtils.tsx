import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";

/**
 * 
 * @param firestore Firestore app instance
 * @param path Firestore table path
 * @param key Table indexing key
 * @returns Fetched value, or null if it doesn't exist
 */
export const fetchWithKey = async <T,>(firestore: Firestore, path: string, key: string): Promise<T | null> => {
	const docRef = doc(firestore, path, key);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const reviver = (key: any, value: any) => {
			if (typeof value === 'object' && value !== null) {
				if (value.dataType === 'Map') {
					return new Map(value.value);
				}
			}
			return value;
		}
		return JSON.parse(docSnap.data().json, reviver) as T;
	}
	return null;
};

/**
 * If the key has a value in the given table in firestore, fetches it.
 * Otherwise, creates one, saves it to firestore at the given key,
 * and returns the newly generated T.
 * 
 * @param firestore Firestore app instance
 * @param path Path to table
 * @param key Table indexing key
 * @param generator Default value generator function for T
 * @returns Fetched or created instance of T.
 */
export const fetchOrCreate = async <T,>(firestore: Firestore, path: string, key: string, generator: () => T): Promise<T> => {
	const fetched = await fetchWithKey<T>(firestore, path, key);
	if (fetched !== null)
		return fetched;
	const t = generator();
	await save(firestore, path, key, t);
	return t;
};

/**
 * 
 * @param firestore Firestore app instance
 * @param path Firestore table path
 * @param key Table indexing key
 * @param val Value to save to the given key in the table.
 */
export const save = async <T,>(firestore: Firestore, path: string, key: string, val: T) => {
	const docRef = doc(firestore, path, key);
	const replacer = (key: any, value: any) => {
		if (value instanceof Map) {
			return {
				dataType: 'Map',
				value: Array.from(value.entries()),
			};
		} else {
			return value;
		}
	}
	await setDoc(docRef, { json: JSON.stringify(val, replacer) })
		.catch(e => console.error(e));
}
