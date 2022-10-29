import * as assert from "../assert.ts";
import * as E from "../error.ts";
import type VM from "../vm.ts";
import type { default as Value, Leaf } from "./index.ts";

export default class Str1DValue implements Value<string[]> {
	public type = "string" as const;
	public name: string;
	public value: string[];

	public static normalizeIndex(name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [0];
		} else if (index.length === 1) {
			return index;
		} else if (index.length === 2 && index[1] === 0) {
			return index.slice(0, -1);
		} else {
			throw E.invalidIndex("1D", name, index);
		}
	}

	public constructor(name: string, size?: number[]) {
		const realSize = size ?? [100];
		assert.cond(
			realSize.length === 1,
			`${name} is not a ${realSize.length}D variable`,
		);

		this.name = name;
		this.value = new Array<string>(realSize[0]).fill("");
	}

	public reset(value: string[] | Map<number, string>): this {
		for (let i = 0; i < this.value.length; ++i) {
			this.value[i] = "";
		}
		if (value instanceof Map) {
			for (const [i, val] of value) {
				this.value[i] = val;
			}
		} else {
			for (let i = 0; i < value.length; ++i) {
				this.value[i] = value[i];
			}
		}

		return this;
	}

	public get(_vm: VM, index: number[]): string {
		const realIndex = Str1DValue.normalizeIndex(this.name, index);
		return this.value[realIndex[0]];
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		const realIndex = Str1DValue.normalizeIndex(this.name, index);
		assert.string(value, "Cannot assign a number to a string variable");

		this.value[realIndex[0]] = value;
	}

	// NOTE: index is ignored (Emuera emulation)
	public rangeSet(
		_vm: VM,
		value: Leaf,
		_index: number[],
		range: [number, number],
	) {
		assert.string(value, "Cannot assign a number to a string variable");
		for (let i = range[0]; i < range[1]; ++i) {
			this.value[i] = value;
		}
	}

	public length(depth: number): number {
		switch (depth) {
			case 0:
				return this.value.length;
			case 1:
				return 1;
			default:
				throw new Error(
					`1D variable doesn't have a value at depth ${depth}`,
				);
		}
	}
}
