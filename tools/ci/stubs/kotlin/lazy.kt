package androidx.compose.foundation.lazy
import ra.compose.RaCompose
class LazyListScope { fun item(content: () -> Unit) { content() } }
fun <T> LazyListScope.items(items: List<T>, itemContent: (T) -> Unit) { items.forEach(itemContent) }
fun LazyListScope.items(count: Int, itemContent: (Int) -> Unit) { repeat(count, itemContent) }
@androidx.compose.runtime.Composable fun LazyColumn(modifier: Any? = null, content: LazyListScope.() -> Unit) { RaCompose.calls.add("LazyColumn"); LazyListScope().content() }
