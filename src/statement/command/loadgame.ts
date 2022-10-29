import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import Statement, { EraGenerator } from "../index.ts";

const PARSER = U.arg0R0();
export default class LoadGame extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(): EraGenerator {
		return {
			type: "begin",
			keyword: "LOADGAME",
		};
	}
}
