# OSI Model Visualizer

An interactive web application to help understand the OSI (Open Systems Interconnection) model and how data flows through the 7 layers.

## Features

- **Interactive Layer Visualization**: Visual representation of all 7 OSI layers with color coding
- **Data Flow Animation**: Watch data flow through layers during sending and receiving
- **Protocol Examples**: See real protocols used at each layer
- **Message Processing Demo**: Enter a message and see how it transforms through each layer
- **Hover Effects**: Get detailed information about each layer's functions
- **Keyboard Shortcuts**: Use Ctrl+↓ to send data, Ctrl+↑ to receive data

## How to Use

1. Open `index.html` in a web browser
2. Click "Send Data" to see data flow from Layer 7 down to Layer 1
3. Click "Receive Data" to see data flow from Layer 1 up to Layer 7
4. Enter a message and click "Process Through Layers" to see encapsulation
5. Hover over any layer card to see additional details

## OSI Layers Overview

### Layer 7: Application Layer
- **Purpose**: User interface and network services
- **Protocols**: HTTP, HTTPS, FTP, SMTP, DNS
- **Function**: Provides network services directly to user applications

### Layer 6: Presentation Layer
- **Purpose**: Data translation and encryption
- **Protocols**: SSL/TLS, JPEG, ASCII, MPEG
- **Function**: Translates data between formats, handles encryption and compression

### Layer 5: Session Layer
- **Purpose**: Managing communication sessions
- **Protocols**: NetBIOS, RPC, SQL
- **Function**: Establishes, manages, and terminates sessions between applications

### Layer 4: Transport Layer
- **Purpose**: End-to-end communication
- **Protocols**: TCP, UDP, SPX
- **Function**: Provides reliable/unreliable data delivery, flow control, segmentation

### Layer 3: Network Layer
- **Purpose**: Routing and packet forwarding
- **Protocols**: IP, ICMP, IPsec, RIP
- **Function**: Determines best path for data, handles routing and addressing

### Layer 2: Data Link Layer
- **Purpose**: Node-to-node data transfer
- **Protocols**: Ethernet, PPP, Frame Relay
- **Function**: Reliable frame transfer, error detection, MAC addressing

### Layer 1: Physical Layer
- **Purpose**: Hardware transmission of bits
- **Protocols**: Ethernet Cables, Fiber Optic, Radio Waves
- **Function**: Transmits raw bit streams over physical medium

## Data Encapsulation Process

When data is sent:
1. **Application Layer**: Creates user data
2. **Presentation Layer**: Formats/encrypts data
3. **Session Layer**: Establishes connection
4. **Transport Layer**: Segments data, adds port numbers
5. **Network Layer**: Adds IP addresses (routing)
6. **Data Link Layer**: Adds MAC addresses (framing)
7. **Physical Layer**: Converts to electrical/optical signals

When data is received, the process happens in reverse (de-encapsulation).

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Animations**: CSS transitions and JavaScript
- **Responsive**: Works on desktop and mobile devices

## Learning Outcomes

After using this visualizer, you will understand:
- How data flows through OSI layers
- What protocols operate at each layer
- The encapsulation and de-encapsulation process
- The purpose of each layer in network communication
- Real-world examples of OSI layer implementation

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use for educational purposes.
