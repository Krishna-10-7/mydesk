let nut = null;

async function setupRemoteControl() {
    try {
        // nut.js is loaded dynamically as it may not be available in all environments
        nut = require('@nut-tree/nut-js');
        nut.mouse.config.autoDelayMs = 0;
        nut.keyboard.config.autoDelayMs = 0;
        console.log('Remote control initialized successfully');
    } catch (error) {
        console.error('Failed to initialize remote control:', error.message);
        console.log('Remote control will be disabled');
    }
}

async function executeMouseAction(action) {
    if (!nut) return;

    try {
        const { type, x, y, button, delta } = action;

        switch (type) {
            case 'move':
                await nut.mouse.setPosition({ x: Math.round(x), y: Math.round(y) });
                break;

            case 'click':
                await nut.mouse.setPosition({ x: Math.round(x), y: Math.round(y) });
                const mouseButton = button === 2 ? nut.Button.RIGHT : nut.Button.LEFT;
                await nut.mouse.click(mouseButton);
                break;

            case 'dblclick':
                await nut.mouse.setPosition({ x: Math.round(x), y: Math.round(y) });
                await nut.mouse.doubleClick(nut.Button.LEFT);
                break;

            case 'mousedown':
                await nut.mouse.setPosition({ x: Math.round(x), y: Math.round(y) });
                await nut.mouse.pressButton(button === 2 ? nut.Button.RIGHT : nut.Button.LEFT);
                break;

            case 'mouseup':
                await nut.mouse.releaseButton(button === 2 ? nut.Button.RIGHT : nut.Button.LEFT);
                break;

            case 'scroll':
                await nut.mouse.scrollDown(delta > 0 ? delta : 0);
                await nut.mouse.scrollUp(delta < 0 ? -delta : 0);
                break;

            default:
                console.log('Unknown mouse action:', type);
        }
    } catch (error) {
        console.error('Mouse action error:', error.message);
    }
}

async function executeKeyboardAction(action) {
    if (!nut) return;

    try {
        const { type, key, code } = action;

        // Map common keys
        const keyMap = {
            'Enter': nut.Key.Enter,
            'Backspace': nut.Key.Backspace,
            'Tab': nut.Key.Tab,
            'Escape': nut.Key.Escape,
            'Space': nut.Key.Space,
            'ArrowUp': nut.Key.Up,
            'ArrowDown': nut.Key.Down,
            'ArrowLeft': nut.Key.Left,
            'ArrowRight': nut.Key.Right,
            'Delete': nut.Key.Delete,
            'Home': nut.Key.Home,
            'End': nut.Key.End,
            'PageUp': nut.Key.PageUp,
            'PageDown': nut.Key.PageDown,
            'Control': nut.Key.LeftControl,
            'Shift': nut.Key.LeftShift,
            'Alt': nut.Key.LeftAlt,
            'Meta': nut.Key.LeftSuper,
            'F1': nut.Key.F1, 'F2': nut.Key.F2, 'F3': nut.Key.F3, 'F4': nut.Key.F4,
            'F5': nut.Key.F5, 'F6': nut.Key.F6, 'F7': nut.Key.F7, 'F8': nut.Key.F8,
            'F9': nut.Key.F9, 'F10': nut.Key.F10, 'F11': nut.Key.F11, 'F12': nut.Key.F12,
        };

        switch (type) {
            case 'keydown':
                if (keyMap[key]) {
                    await nut.keyboard.pressKey(keyMap[key]);
                } else if (key.length === 1) {
                    await nut.keyboard.type(key);
                }
                break;

            case 'keyup':
                if (keyMap[key]) {
                    await nut.keyboard.releaseKey(keyMap[key]);
                }
                break;

            default:
                console.log('Unknown keyboard action:', type);
        }
    } catch (error) {
        console.error('Keyboard action error:', error.message);
    }
}

module.exports = { setupRemoteControl, executeMouseAction, executeKeyboardAction };
