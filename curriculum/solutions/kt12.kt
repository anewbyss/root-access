import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

sealed interface UiState {
    data object Loading : UiState
    data class Ready(val alerts: List<String>) : UiState
}

class ConsoleViewModel : ViewModel() {
    private val _state = MutableStateFlow<UiState>(UiState.Loading)
    val state: StateFlow<UiState> = _state

    fun refresh() {
        viewModelScope.launch {
            _state.value = UiState.Loading
            delay(200)
            _state.value = UiState.Ready(listOf("north up", "harbor down"))
        }
    }
}

@Composable
fun ConsoleScreen(vm: ConsoleViewModel) {
    val state by vm.state.collectAsState()
    var taps by remember { mutableStateOf(0) }
    Button(onClick = { taps++; vm.refresh() }) { Text("Refresh ($taps)") }
    when (val s = state) {
        UiState.Loading -> Text("loading...")
        is UiState.Ready -> LazyColumn {
            items(s.alerts) { alert -> Text(alert) }
        }
    }
}
