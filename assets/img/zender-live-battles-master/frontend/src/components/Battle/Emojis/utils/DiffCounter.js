import mergeWith from 'lodash/mergeWith';
import isEqual from 'lodash/isEqual';

export const calculateDiffCounters = (old_counters, new_counters) => {
	const diff = {}
	mergeWith(old_counters, new_counters, (objectValue, sourceValue, key) => {
		if (!(isEqual(objectValue, sourceValue)) && (Object(objectValue) !== objectValue)) {
			const amount = parseInt(sourceValue, 10) - parseInt(objectValue, 10);
			diff[key] = amount;					    	
		}
	});
	return diff;
}

export default calculateDiffCounters;