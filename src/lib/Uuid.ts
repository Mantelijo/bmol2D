// Cache
const usedUUUIDs = new Set();

// Guaranteed unique uuid for current session
export const uuid: () => string = () => {
	//@ts-ignore
	const val = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
	);

	// Here we make sure only unique uuids are provided
	if (usedUUUIDs.has(val)) {
		return uuid();
	}
	usedUUUIDs.add(val);

	return val;
};
