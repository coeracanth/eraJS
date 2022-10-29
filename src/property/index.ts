import type Define from "./define.ts";
import type Dim from "./dim.ts";
import type LocalSize from "./localsize.ts";
import type LocalSSize from "./localssize.ts";
import type Method from "./method.ts";
import type Order from "./order.ts";
import type Single from "./single.ts";

type Property =
	| Define
	| Dim
	| LocalSize
	| LocalSSize
	| Method
	| Order
	| Single;

export default Property;
