import * as assert from "../assert.ts";
import * as E from "../error.ts";
import type VM from "../vm.ts";
import type { default as Value, Leaf } from "./index.ts";
import Int0DValue from "./int-0d.ts";
import Int1DValue from "./int-1d.ts";

export default class IntChar0DValue implements Value<never> {
	public type = "number" as const;
	public name: string;
	public value!: never;

	public static normalizeIndex(
		vm: VM,
		name: string,
		index: number[],
	): number[] {
		if (index.length === 0) {
			return [Number(vm.getValue<Int1DValue>("TARGET").get(vm, []))];
		} else if (index.length === 1) {
			return index;
		} else if (index.length === 2 && index[1] === 0) {
			return index.slice(0, -1);
		} else {
			throw E.invalidIndex("0D character", name, index);
		}
	}

	public constructor(name: string) {
		this.name = name;
	}

	public reset(): this {
		throw E.internal(`0D character variable ${this.name} cannot be reset`);
	}

	public get(vm: VM, index: number[]): bigint {
		const realIndex = IntChar0DValue.normalizeIndex(vm, this.name, index);
		if (vm.characterList.length <= realIndex[0]) {
			throw E.notFound("Character", `#${realIndex[0]}`);
		}

		const cell = vm.characterList[realIndex[0]].getValue<Int0DValue>(
			this.name,
		)!;
		return cell.get(vm, realIndex.slice(1));
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		const realIndex = IntChar0DValue.normalizeIndex(vm, this.name, index);
		assert.bigint(value, "Cannot assign a string to a numeric variable");
		if (vm.characterList.length <= realIndex[0]) {
			throw E.notFound("Character", `#${realIndex[0]}`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		cell.set(vm, value, realIndex.slice(1));
	}

	public rangeSet(
		vm: VM,
		value: Leaf,
		index: number[],
		_range: [number, number],
	) {
		this.set(vm, value, index);
	}

	public length(depth: number): number {
		switch (depth) {
			case 0:
				return 1;
			case 1:
				return 1;
			default:
				throw new Error(
					`1D character variable doesn't have a value at depth ${depth}`,
				);
		}
	}
}
