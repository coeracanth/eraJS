import * as U from "../../parser/util";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class GetStyle extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run() {
		throw new Error("GETSTYLE is not implemented yet!");

		return null;
	}
}
