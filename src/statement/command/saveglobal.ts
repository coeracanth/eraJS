import * as U from "../../parser/util.ts";
import Dim from "../../property/dim.ts";
import { GlobalSave, savefile } from "../../savedata.ts";
import Slice from "../../slice.ts";
import Int0DValue from "../../value/int-0d.ts";
import Int1DValue from "../../value/int-1d.ts";
import Int2DValue from "../../value/int-2d.ts";
import Int3DValue from "../../value/int-3d.ts";
import Str0DValue from "../../value/str-0d.ts";
import Str1DValue from "../../value/str-1d.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

export const whitelist = ["GLOBAL", "GLOBALS"];

const PARSER = U.arg0R0();
export default class SaveGlobal extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public async *run(vm: VM) {
		const saveData: GlobalSave = {
			code: vm.code.csv.gamebase.code ?? 0,
			version: vm.code.csv.gamebase.version ?? 0,
			data: {},
		};
		saveData.data.GLOBAL = vm.getValue<Int1DValue>("GLOBAL").value.map(
			(value) => value.toString(),
		);
		saveData.data.GLOBALS = vm.getValue<Str1DValue>("GLOBALS").value;
		for (const property of vm.code.header) {
			if (
				property instanceof Dim && property.isSave() &&
				property.isGlobal()
			) {
				const cell = vm.getValue(property.name);
				if (cell instanceof Int0DValue) {
					saveData.data[property.name] = cell.value.toString();
				} else if (cell instanceof Int1DValue) {
					saveData.data[property.name] = cell.value.map((value) =>
						value.toString()
					);
				} else if (cell instanceof Int2DValue) {
					saveData.data[property.name] = cell.value.map(
						(value0) => value0.map((value1) => value1.toString()),
					);
				} else if (cell instanceof Int3DValue) {
					saveData.data[property.name] = cell.value.map(
						(value0) =>
							value0.map(
								(value1) =>
									value1.map((value2) => value2.toString()),
							),
					);
				} else if (cell instanceof Str0DValue) {
					saveData.data[property.name] = cell.value;
				} else if (cell instanceof Str1DValue) {
					saveData.data[property.name] = cell.value;
				}
			}
		}

		await vm.external.setSavedata(
			savefile.global,
			JSON.stringify(saveData),
		);

		return null;
	}
}
