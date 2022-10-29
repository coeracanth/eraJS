import Property from "../property/index.ts";
import prop from "./property.ts";
import { normalize, preprocess, toLines } from "./preprocess.ts";
import * as U from "./util.ts";

export default function parseERH(
	files: Map<string, string>,
	macros: Set<string>,
): Property[] {
	const result: Property[] = [];

	for (const [name, content] of files) {
		const normalized = normalize(content);
		const lines = preprocess(toLines(normalized), macros);
		for (const line of lines) {
			line.file = name;
		}

		for (const line of lines) {
			result.push(U.tryParse(prop, line));
		}
	}

	return result;
}
