package androidx.lifecycle
import kotlinx.coroutines.*
abstract class ViewModel { internal val raViewModelScope = CoroutineScope(SupervisorJob() + Dispatchers.Default); protected open fun onCleared() {} }
val ViewModel.viewModelScope: CoroutineScope get() = raViewModelScope
