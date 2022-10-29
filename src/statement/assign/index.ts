import P from "../../../deps/parsimmon.ts";

import * as E from "../../error.ts";
import * as C from "../../parser/const.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";
import AssignForm from "./assign-form.ts";
import AssignInt from "./assign-int.ts";
import AssignOpInt from "./assign-op-int.ts";
import AssignOpStr from "./assign-op-str.ts";
import AssignPrefix from "./assign-prefix.ts";
import AssignPostfix from "./assign-postfix.ts";
import AssignStr from "./assign-str.ts";

const PARSER_PREFIX = P.seq(U.alt("++", "--").trim(C.WS0), X.variable, P.all);
const PARSER_POSTFIX = P.seq(X.variable, U.alt("++", "--").trim(C.WS0), P.all);
const PARSER_VAR = P.seq(
  X.variable,
  P.alt(
    U.alt("="),
    U.alt("'="),
    U.alt("*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="),
  ).trim(C.WS0),
  P.all,
);
export default class Assign extends Statement {
  public inner?:
    | AssignForm
    | AssignInt
    | AssignOpInt
    | AssignOpStr
    | AssignPostfix
    | AssignStr;

  public constructor(raw: Slice) {
    super(raw);
  }

  private compile(vm: VM) {
    try {
      const [op, dest, rest] = U.tryParse(PARSER_PREFIX, this.raw);
      const restSlice = this.raw.slice(this.raw.length() - rest.length);
      const destType = dest.getCell(vm).type;
      if (op === "++" && destType === "number") {
        this.inner = new AssignPrefix(dest, "++", restSlice);
      } else if (op === "--" && destType === "number") {
        this.inner = new AssignPrefix(dest, "--", restSlice);
      }
      return;
    } catch { /* Do nothing */ }
    try {
      const [dest, op, rest] = U.tryParse(PARSER_POSTFIX, this.raw);
      const restSlice = this.raw.slice(this.raw.length() - rest.length);
      const destType = dest.getCell(vm).type;
      if (op === "++" && destType === "number") {
        this.inner = new AssignPostfix(dest, "++", restSlice);
      } else if (op === "--" && destType === "number") {
        this.inner = new AssignPostfix(dest, "--", restSlice);
      }
      return;
    } catch { /* Do nothing */ }
    try {
      const [dest, op, rest] = U.tryParse(PARSER_VAR, this.raw);
      const restSlice = this.raw.slice(this.raw.length() - rest.length);
      const destType = dest.getCell(vm).type;
      if (op === "=" && destType === "number") {
        this.inner = new AssignInt(dest, restSlice);
      } else if (op === "=" && destType === "string") {
        this.inner = new AssignForm(dest, restSlice);
      } else if (op === "'=") {
        this.inner = new AssignStr(dest, restSlice);
      } else if (op === "+=" && destType === "string") {
        this.inner = new AssignOpStr(dest, "+=", restSlice);
      } else if (
        ["*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="].includes(op) &&
        destType === "number"
      ) {
        this.inner = new AssignOpInt(
          dest,
          op as AssignOpInt["operator"],
          restSlice,
        );
      }
      return;
    } catch { /* Do nothing */ }
    throw E.parser("Invalid assignment expression");
  }

  public async *run(vm: VM) {
    if (this.inner == null) {
      this.compile(vm);
    }

    return yield* vm.run(this.inner!);
  }
}
