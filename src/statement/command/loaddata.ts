import * as assert from "../../assert.ts";
import Character from "../../character.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import { GameSave, savefile } from "../../savedata.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import Int0DValue from "../../value/int-0d.ts";
import Int1DValue from "../../value/int-1d.ts";
import Int2DValue from "../../value/int-2d.ts";
import Int3DValue from "../../value/int-3d.ts";
import Str0DValue from "../../value/str-0d.ts";
import Str1DValue from "../../value/str-1d.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement, { EraGenerator } from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class LoadData extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const index = await this.arg.get().reduce(vm);
		assert.bigint(index, "Argument of LOADDATA must be a number");

		const file = savefile.game(Number(index));
		const raw = await vm.external.getSavedata(file);
		assert.nonNull(raw, `Save file ${file} does not exist`);
		try {
			const parsed: GameSave = JSON.parse(raw);
			assert.string(parsed.data.comment, "");
			assert.array(parsed.data.characters, "");
			const newCharacters: Character[] = [];
			for (const character of parsed.data.characters) {
				const newCharacter = new Character(vm, {
					no: 0,
					name: "",
					callname: "",
					nickname: "",
					mastername: "",
					base: new Map(),
					maxBase: new Map(),
					mark: new Map(),
					exp: new Map(),
					abl: new Map(),
					talent: new Map(),
					relation: new Map(),
					cflag: new Map(),
					equip: new Map(),
					juel: new Map(),
					cstr: new Map(),
				});
				for (const [name, value] of Object.entries(character)) {
					const cell = newCharacter.getValue(name);
					if (cell instanceof Int0DValue) {
						assert.string(value, "");
						cell.reset(BigInt(value));
					} else if (cell instanceof Int1DValue) {
						assert.strArray(value, "");
						cell.reset(value.map((v) => BigInt(v)));
					} else if (cell instanceof Str0DValue) {
						assert.string(value, "");
						cell.reset(value);
					} else if (cell instanceof Str1DValue) {
						assert.strArray(value, "");
						cell.reset(value);
					}
				}
				newCharacters.push(newCharacter);
			}
			vm.characterList = newCharacters;

			for (const [name, value] of Object.entries(parsed.data.variables)) {
				const cell = vm.getValue(name);
				if (cell instanceof Int0DValue) {
					assert.string(value, "");
					cell.reset(BigInt(value));
				} else if (cell instanceof Int1DValue) {
					assert.strArray(value, "");
					cell.reset(value.map((v) => BigInt(v)));
				} else if (cell instanceof Int2DValue) {
					assert.strArray2D(value, "");
					cell.reset(value.map((v0) => v0.map((v1) => BigInt(v1))));
				} else if (cell instanceof Int3DValue) {
					assert.strArray3D(value, "");
					cell.reset(
						value.map((v0) =>
							v0.map((v1) => v1.map((v2) => BigInt(v2)))
						),
					);
				} else if (cell instanceof Str0DValue) {
					assert.string(value, "");
					cell.reset(value);
				} else if (cell instanceof Str1DValue) {
					assert.strArray(value, "");
					cell.reset(value);
				} else {
					throw new Error("");
				}
			}

			vm.getValue("LASTLOAD_VERSION").set(vm, BigInt(parsed.version), []);
			vm.getValue("LASTLOAD_TEXT").set(vm, parsed.data.comment, []);
		} catch {
			throw new Error(`Save file ${file} is not in a valid format`);
		}

		return {
			type: "begin",
			keyword: "DATALOADED",
		};
	}
}
