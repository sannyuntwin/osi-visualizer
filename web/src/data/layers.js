export const osiLayers = [
  {
    number: 7,
    name: 'Application Layer',
    description: 'User interface and network services',
    fullDescription: 'Provides network services directly to user applications. This is where you interact with the network.',
    protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS'],
    color: '#ef4444',
    functions: ['User interface', 'Network services', 'Resource sharing', 'File transfers']
  },
  {
    number: 6,
    name: 'Presentation Layer',
    description: 'Data translation and encryption',
    fullDescription: 'Translates data between application format and network format. Handles encryption, compression, and character encoding.',
    protocols: ['SSL/TLS', 'JPEG', 'ASCII', 'MPEG'],
    color: '#f97316',
    functions: ['Data encryption', 'Compression', 'Character encoding', 'Format conversion']
  },
  {
    number: 5,
    name: 'Session Layer',
    description: 'Managing communication sessions',
    fullDescription: 'Establishes, manages, and terminates sessions between applications. Handles authentication and authorization.',
    protocols: ['NetBIOS', 'RPC', 'SQL'],
    color: '#eab308',
    functions: ['Session management', 'Authentication', 'Authorization', 'Synchronization']
  },
  {
    number: 4,
    name: 'Transport Layer',
    description: 'End-to-end communication',
    fullDescription: 'Provides reliable or unreliable data delivery. Manages flow control, error checking, and data segmentation.',
    protocols: ['TCP', 'UDP', 'SPX'],
    color: '#22c55e',
    functions: ['Segmentation', 'Flow control', 'Error checking', 'Reliable delivery']
  },
  {
    number: 3,
    name: 'Network Layer',
    description: 'Routing and packet forwarding',
    fullDescription: 'Determines the best physical path for data to travel. Handles routing, addressing, and packet forwarding.',
    protocols: ['IP', 'ICMP', 'IPsec', 'RIP'],
    color: '#06b6d4',
    functions: ['Routing', 'Logical addressing', 'Packet forwarding', 'Path determination']
  },
  {
    number: 2,
    name: 'Data Link Layer',
    description: 'Node-to-node data transfer',
    fullDescription: 'Provides reliable transfer of data frames between nodes. Handles error detection and MAC addresses.',
    protocols: ['Ethernet', 'PPP', 'Frame Relay'],
    color: '#3b82f6',
    functions: ['Frame synchronization', 'Error detection', 'MAC addressing', 'Flow control']
  },
  {
    number: 1,
    name: 'Physical Layer',
    description: 'Hardware transmission of bits',
    fullDescription: 'Transmits raw bit streams over physical medium. Defines hardware specifications for cables, switches, and signals.',
    protocols: ['Ethernet Cables', 'Fiber Optic', 'Radio Waves'],
    color: '#8b5cf6',
    functions: ['Bit transmission', 'Signal encoding', 'Physical topology', 'Hardware specifications']
  }
];
