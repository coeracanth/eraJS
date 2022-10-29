import * as C from "../../parser/const.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(C.charSeq());
export default class CustomDrawLine extends Statement {
  public arg: Lazy<string>;

  public constructor(raw: Slice) {
    super(raw);

    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    const value = this.arg.get();

    yield* vm.printer.line(value);

    return null;
  }
}
