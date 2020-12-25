import * as U from "../../erb/util";
import * as color from "../../color";
import VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class GetFocusColor extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		vm.getValue("RESULT").set(vm, color.toHex(vm.color.focus), [0]);

		return null;
	}
}
