import { AnyComponent } from "preact";

export {
	Attributes,
	FunctionalComponent as SFC,
	AnyComponent as ComponentType,
	Component as ComponentClass,
	ClassAttributes,
	PreactContext as Context,
	PreactProvider as Provider,
	VNode as ReactElement,
	VNode as ReactNode,
	createElement,
	Fragment,
	Ref,
	render,
	JSX,
	RenderableProps as ComponentPropsWithRef,
} from "preact";

export type JSXElementConstructor = AnyComponent;
