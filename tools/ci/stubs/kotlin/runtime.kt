package androidx.compose.runtime
import kotlin.reflect.KProperty
import kotlinx.coroutines.flow.StateFlow
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.FUNCTION, AnnotationTarget.TYPE, AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.PROPERTY_GETTER)
annotation class Composable
interface State<out T> { val value: T }
interface MutableState<T> : State<T> { override var value: T }
private class Box<T>(override var value: T) : MutableState<T>
fun <T> mutableStateOf(value: T): MutableState<T> = Box(value)
fun mutableIntStateOf(value: Int): MutableState<Int> = Box(value)
inline fun <T> remember(calculation: () -> T): T = calculation()
inline fun <T> remember(vararg keys: Any?, calculation: () -> T): T = calculation()
operator fun <T> State<T>.getValue(thisObj: Any?, property: KProperty<*>): T = value
operator fun <T> MutableState<T>.setValue(thisObj: Any?, property: KProperty<*>, value: T) { this.value = value }
fun <T> StateFlow<T>.collectAsState(): State<T> { val f = this; return object : State<T> { override val value: T get() = f.value } }
@Composable fun LaunchedEffect(key1: Any?, block: suspend kotlinx.coroutines.CoroutineScope.() -> Unit) { ra.compose.RaCompose.calls.add("LaunchedEffect") }
