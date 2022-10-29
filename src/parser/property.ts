import P from "../../deps/parsimmon.ts";

import type Property from "../property/index.ts";
import Define from "../property/define.ts";
import Dim from "../property/dim.ts";
import LocalSize from "../property/localsize.ts";
import LocalSSize from "../property/localssize.ts";
import Method from "../property/method.ts";
import Order from "../property/order.ts";
import Single from "../property/single.ts";
import * as C from "./const.ts";
import * as X from "./expr.ts";
import * as U from "./util.ts";

const parser = P.string("#").then(P.alt<Property>(
	P.regex(/DEFINE/i).skip(C.WS1).then(P.seqMap(
		C.Identifier,
		C.WS1,
		X.expr,
		(name, _2, expr) => new Define(name, expr),
	)),
	P.regex(/PRI/i).then(U.arg0R0()).map(() => new Order("PRI")),
	P.regex(/LATER/i).map(() => new Order("LATER")),
	P.regex(/SINGLE/i).map(() => new Single()),
	P.regex(/FUNCTIONS/i).map(() => new Method()),
	P.regex(/FUNCTION/i).map(() => new Method()),
	P.regex(/LOCALSIZE/i).skip(C.WS1).then(X.expr).map((expr) =>
		new LocalSize(expr)
	),
	P.regex(/LOCALSSIZE/i).skip(C.WS1).then(X.expr).map((expr) =>
		new LocalSSize(expr)
	),
	P.regex(/DIM/i).skip(C.WS1).then(P.seqMap(
		P.alt(
			P.regex(/CONST/i).skip(C.WS1),
			P.regex(/DYNAMIC/i).skip(C.WS1),
			P.regex(/GLOBAL/i).skip(C.WS1),
			P.regex(/REF/i).skip(C.WS1),
			P.regex(/SAVEDATA/i).skip(C.WS1),
			P.regex(/CHARADATA/i).skip(C.WS1),
		).many(),
		U.sepBy1(",", C.Identifier, X.expr),
		P.alt(
			P.string("=").trim(C.WS0).then(U.sepBy0(",", X.expr)),
			P.succeed(undefined),
		),
		P.string(",").fallback(null),
		(prefix, [name, ...size], value) =>
			new Dim(name, "number", prefix, size, value),
	)),
	P.regex(/DIMS/i).skip(C.WS1).then(P.seqMap(
		P.alt(
			P.regex(/CONST/i).skip(C.WS1),
			P.regex(/DYNAMIC/i).skip(C.WS1),
			P.regex(/GLOBAL/i).skip(C.WS1),
			P.regex(/REF/i).skip(C.WS1),
			P.regex(/SAVEDATA/i).skip(C.WS1),
			P.regex(/CHARADATA/i).skip(C.WS1),
		).many(),
		U.sepBy1(",", C.Identifier, X.expr),
		P.alt(
			P.string("=").trim(C.WS0).then(U.sepBy0(",", X.expr)),
			P.succeed(undefined),
		),
		P.string(",").fallback(null),
		(prefix, [name, ...size], value) =>
			new Dim(name, "string", prefix, size, value),
	)),
));

export default parser;
