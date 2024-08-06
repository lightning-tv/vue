## Component Lifecycle (onMount, onCleanup)

VueJS offers two primary lifecycle hooks to manage component behavior:

-[onMount](https://www.vuejs.org/docs/latest/api#onmount): Executes a function when the component is first inserted. -[onCleanup](https://www.vuejs.org/docs/latest/api#oncleanup): Executes a function to clean up resources when the component is removed.

For detailed information, refer to the [VueJS Lifecycle documentation](https://docs.vuejs.org/references/api-reference/lifecycles/onMount)

## Built in Events

```jsx
  onCreate: (target: ElementNode) // available on each node
  onBeforeLayout: (this: ElementNode, target: ElementNode, child?: ElementNode, dimensions?: Dimensions) => boolean
  onLayout: (this: ElementNode, target: ElementNode, child?: ElementNode, dimensions?: Dimensions)
```

Learn more about the [layout events](/layout.md)

## Renderer Events

In addition to the Lifecycle events from VueJS, the Lightning Renderer offers additional events for you to tie into using `onEvents` array:

```jsx
<View onEvents={[
  ['loaded', (element, eventInfo) => { console.log('load was called')}]
  ['failed', (element, eventInfo) => { console.log('fail was called')}]
]}>
```

Additional events from renderer are: `outOfBounds`, `inBounds`, `outOfViewPort`, `inViewPort`
