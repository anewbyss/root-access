package androidx.compose.material3
import ra.compose.RaCompose
@androidx.compose.runtime.Composable fun Text(text: String, modifier: Any? = null) { RaCompose.calls.add("Text") }
@androidx.compose.runtime.Composable fun Button(onClick: () -> Unit, modifier: Any? = null, enabled: Boolean = true, content: () -> Unit) {
    RaCompose.calls.add("Button"); RaCompose.onClicks.add(onClick); content()
}
