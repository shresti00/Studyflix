import React, { useState, useEffect } from 'react';
import '../css/playlists.css';
import Navbar from '../components/Navbar';
import { useProfile } from '../context/ProfileContext';
import useYouTube from '../hooks/useYouTube';

import thumb1 from '../assets/images/thumb1.jpg';
import thumb2 from '../assets/images/thumb2.jpg';
import thumb3 from '../assets/images/thumb3.jpg';
import thumb4 from '../assets/images/thumb4.jpg';
import os1 from '../assets/images/os1.jpg';
import os2 from '../assets/images/os2.jpg';
import os3 from '../assets/images/os3.jpg';
import os4 from '../assets/images/os4.jpg';
import cn1 from '../assets/images/cn1.jpg';
import cn2 from '../assets/images/cn2.jpg';
import cn3 from '../assets/images/cn3.jpg';
import cn4 from '../assets/images/cn4.jpg';
import db1 from '../assets/images/db1.jpg';
import db2 from '../assets/images/db2.jpg';
import db3 from '../assets/images/db3.jpg';
import db4 from '../assets/images/db4.jpg';
import mpmc1 from '../assets/images/mpmc1.jpeg';
import mlImg from '../assets/images/ml.png';

// Fallback uses YouTube SEARCH links — these always work even without an API key.
// Format: https://www.youtube.com/results?search_query=... (opens YouTube search for that topic)
// This guarantees clicking always opens a real working YouTube page.

const makeSearchUrl = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

const SUBJECTS = [
  {
    key: 'DSA',
    title: 'Data Structure and Algorithm',
    description: 'DSA is the study of how data is stored and organized, and how problems are solved efficiently using that data. It helps in writing faster, optimized programs and improves problem-solving skills.',
    lecturer: 'Jenny',
    totalHours: '12 hours',
    query: 'Jenny lectures Data Structures Algorithms',
    fallback: [
      { id: null, url: makeSearchUrl('Jenny lectures 1.1 Arrays in Data Structure declaration initialization'), thumb: thumb1, title: '1.1 Arrays in Data Structures', desc: 'An array stores multiple values of the same type in contiguous memory. Each element is accessed using an index starting from 0, allowing fast and direct access with a fixed size.', duration: '23m' },
      { id: null, url: makeSearchUrl('Jenny lectures 1.2 Array Operations traversal insertion data structure'), thumb: thumb2, title: '1.2 Array Operations - Traversal & Insertion', desc: 'Array operations include traversal and insertion. This covers how to insert elements at the beginning, end, or any position in an array with a C program.', duration: '30m' },
      { id: null, url: makeSearchUrl('Jenny lectures 1.3 Array deletion data structure'), thumb: thumb3, title: '1.3 Array Operations - Deletion', desc: 'Deletion from an array involves shifting elements after removing an element. This lecture covers all cases of array deletion with complete code examples.', duration: '22m' },
      { id: null, url: makeSearchUrl('Jenny lectures 2.1 Linked List introduction data structure'), thumb: thumb4, title: '2.1 Introduction to Linked Lists', desc: 'A linked list is a linear data structure with nodes containing data and a pointer to the next node. It enables dynamic memory and efficient insertion/deletion.', duration: '28m' },
      { id: null, url: makeSearchUrl('Jenny lectures 2.2 Linked List insertion C program'), thumb: thumb1, title: '2.2 Linked List - Insertion', desc: 'Covers insertion in a singly linked list at the beginning, end, and at any given position, explained with detailed C programs.', duration: '35m' },
      { id: null, url: makeSearchUrl('Jenny lectures 2.3 Linked List deletion C program'), thumb: thumb2, title: '2.3 Linked List - Deletion', desc: 'Deletion from a linked list involves updating pointers and freeing memory. All deletion cases are explained with clear C programs.', duration: '30m' },
      { id: null, url: makeSearchUrl('Jenny lectures 2.4 Linked List reversal iterative recursive'), thumb: thumb3, title: '2.4 Reversing a Linked List', desc: 'How to reverse a singly linked list using both iterative and recursive approaches, with C programs and step-by-step examples.', duration: '32m' },
      { id: null, url: makeSearchUrl('Jenny lectures 2.5 Doubly linked list data structure'), thumb: thumb4, title: '2.5 Doubly Linked List', desc: 'A doubly linked list has pointers to both next and previous nodes. This lecture covers creation, insertion, and deletion from a doubly linked list.', duration: '38m' },
      { id: null, url: makeSearchUrl('Jenny lectures 2.6 Circular linked list data structure'), thumb: thumb1, title: '2.6 Circular Linked List', desc: 'In a circular linked list, the last node points back to the first node. This lecture covers creation and insertion in circular linked lists with C programs.', duration: '25m' },
      { id: null, url: makeSearchUrl('Jenny lectures 3.1 Stack introduction data structure'), thumb: thumb2, title: '3.1 Stack - Introduction', desc: 'A stack is a LIFO data structure. This lecture introduces the concept of a stack, its properties, and basic operations: push, pop, and peek with examples.', duration: '20m' },
      { id: null, url: makeSearchUrl('Jenny lectures 3.2 Stack implementation array data structure'), thumb: thumb3, title: '3.2 Stack Using Array', desc: 'Implementation of a stack using an array in C, covering push, pop, peek, and traversal operations with complete program code.', duration: '30m' },
      { id: null, url: makeSearchUrl('Jenny lectures 3.3 Stack implementation linked list'), thumb: thumb4, title: '3.3 Stack Using Linked List', desc: 'Implementation of a stack using a linked list, covering dynamic memory allocation and all stack operations with a full C program.', duration: '28m' },
      { id: null, url: makeSearchUrl('Jenny lectures 3.4 Infix prefix postfix expressions data structure'), thumb: thumb1, title: '3.4 Infix, Prefix and Postfix Expressions', desc: 'Explains the three types of arithmetic expressions and how to evaluate them, with examples and rules for operator precedence and associativity.', duration: '25m' },
      { id: null, url: makeSearchUrl('Jenny lectures 3.5 Infix to Postfix conversion stack'), thumb: thumb2, title: '3.5 Infix to Postfix Conversion', desc: 'Converting an infix expression to postfix using a stack. Covers operator precedence, associativity, and the algorithm with step-by-step examples.', duration: '35m' },
      { id: null, url: makeSearchUrl('Jenny lectures 4.1 Queue introduction data structure'), thumb: thumb3, title: '4.1 Queue - Introduction', desc: 'A queue is a FIFO data structure. This lecture covers the introduction, need, and basic operations of a queue: enqueue and dequeue with examples.', duration: '22m' },
      { id: null, url: makeSearchUrl('Jenny lectures 4.2 Queue implementation array data structure'), thumb: thumb4, title: '4.2 Queue Using Array', desc: 'Array-based implementation of a queue in C, with enqueue, dequeue, and display operations and explanation of queue limitations.', duration: '30m' },
      { id: null, url: makeSearchUrl('Jenny lectures 4.4 Circular queue data structure'), thumb: thumb1, title: '4.4 Circular Queue', desc: 'A circular queue overcomes the limitation of a linear queue by reusing empty spaces. This lecture covers circular queue operations with a C program.', duration: '32m' },
      { id: null, url: makeSearchUrl('Jenny lectures 5.1 Tree introduction binary tree data structure'), thumb: thumb2, title: '5.1 Trees - Introduction', desc: 'A tree is a non-linear hierarchical data structure. This lecture introduces tree terminology: root, node, leaf, height, depth, and degree with examples.', duration: '25m' },
      { id: null, url: makeSearchUrl('Jenny lectures 5.2 Binary Tree types data structure'), thumb: thumb3, title: '5.2 Binary Trees and Its Types', desc: 'A binary tree has at most two children per node. This covers types: full binary tree, complete binary tree, perfect binary tree with properties.', duration: '30m' },
      { id: null, url: makeSearchUrl('Jenny lectures 5.5 Binary Tree traversal inorder preorder postorder'), thumb: thumb4, title: '5.5 Binary Tree Traversals', desc: 'Inorder, Preorder, and Postorder traversals are the three standard ways to visit nodes in a binary tree. Each traversal method is explained with examples.', duration: '35m' },
      { id: null, url: makeSearchUrl('Jenny lectures Binary Search Tree insertion deletion'), thumb: thumb1, title: '5.7 Binary Search Tree (BST)', desc: 'A BST organizes nodes so left children are smaller and right children are larger than the parent. Covers insertion, deletion, and search operations.', duration: '40m' },
      { id: null, url: makeSearchUrl('Jenny lectures Heap data structure min max heap'), thumb: thumb2, title: '5.12 Heap Data Structure', desc: 'A heap is a complete binary tree where each node satisfies the heap property. Covers min-heap, max-heap, insertion, deletion, and heapify operations.', duration: '38m' },
      { id: null, url: makeSearchUrl('Jenny lectures AVL Tree rotation data structure'), thumb: thumb3, title: '5.14 AVL Trees', desc: 'An AVL tree is a self-balancing BST. This lecture explains AVL tree rotations (LL, RR, LR, RL) and how balance is maintained during insertion.', duration: '42m' },
      { id: null, url: makeSearchUrl('Jenny lectures Graph representation adjacency matrix list'), thumb: thumb4, title: '6.1 Graph Representation', desc: 'Graphs are used to represent networks. This lecture covers graph terminology and two representations: adjacency matrix and adjacency list.', duration: '28m' },
      { id: null, url: makeSearchUrl('Jenny lectures BFS Breadth First Search graph'), thumb: thumb1, title: '6.2 BFS - Breadth First Search', desc: 'BFS explores all neighbors of a node before going deeper. It uses a queue and is used for shortest path problems in unweighted graphs.', duration: '32m' },
      { id: null, url: makeSearchUrl('Jenny lectures DFS Depth First Search graph'), thumb: thumb2, title: '6.3 DFS - Depth First Search', desc: 'DFS explores as far as possible along each branch before backtracking. It uses a stack (or recursion) and is used for topological sort and cycle detection.', duration: '30m' },
      { id: null, url: makeSearchUrl('Jenny lectures Bubble Sort algorithm data structure'), thumb: thumb3, title: '7.1 Bubble Sort', desc: 'Bubble sort repeatedly swaps adjacent elements if they are in the wrong order. It is the simplest sorting algorithm with O(n²) time complexity.', duration: '25m' },
      { id: null, url: makeSearchUrl('Jenny lectures Merge Sort algorithm data structure'), thumb: thumb4, title: '7.3 Merge Sort', desc: 'Merge sort is a divide-and-conquer algorithm that splits, sorts, and merges arrays. It has O(n log n) time complexity and is stable.', duration: '38m' },
      { id: null, url: makeSearchUrl('Jenny lectures Quick Sort algorithm data structure'), thumb: thumb1, title: '7.4 Quick Sort', desc: 'Quick sort uses a pivot to partition the array and recursively sort subarrays. It has O(n log n) average time complexity and is widely used in practice.', duration: '40m' },
      { id: null, url: makeSearchUrl('Jenny lectures Hashing hash table data structure'), thumb: thumb2, title: '8.1 Hashing and Hash Tables', desc: 'Hashing maps keys to indices using a hash function for O(1) average lookup. This covers hash tables, collision handling: chaining and open addressing.', duration: '35m' },
    ],
  },
  {
    key: 'OS',
    title: 'Operating Systems',
    description: 'An Operating System manages computer hardware and software resources. It acts as an interface between the user and hardware, handling processes, memory, file systems, and I/O devices.',
    lecturer: 'Neso Academy',
    totalHours: '10 hours',
    query: 'Neso Academy Operating Systems full course',
    fallback: [
      { id: null, url: makeSearchUrl('Neso Academy 1 Introduction to Operating Systems'), thumb: os1, title: '1. Introduction to Operating Systems', desc: 'An OS manages hardware and software resources. It provides an interface between user and hardware, offering services like process and memory management.', duration: '14m' },
      { id: null, url: makeSearchUrl('Neso Academy 2 Types of Operating Systems'), thumb: os2, title: '2. Types of Operating Systems', desc: 'Types include batch, time-sharing, distributed, real-time, and network OS. Each type is designed for specific use cases and environments.', duration: '12m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Structure of an Operating System'), thumb: os3, title: '3. Structure of an Operating System', desc: 'The OS can be structured as monolithic, layered, microkernel, or modular. Each design has trade-offs in performance, security, and maintainability.', duration: '18m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Process and Process States'), thumb: os4, title: '4. Process and Process States', desc: 'A process is a program in execution. OS manages five states: new, ready, running, waiting, and terminated. Transitions between states are explained.', duration: '16m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Process Control Block PCB'), thumb: os1, title: '5. Process Control Block (PCB)', desc: 'A PCB holds all information about a process: process ID, state, program counter, registers, memory info, and scheduling data for OS management.', duration: '15m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Process Scheduling'), thumb: os2, title: '6. Process Scheduling', desc: 'Scheduling decides which process runs on the CPU. Long-term, short-term, and medium-term schedulers manage process queues and CPU allocation.', duration: '20m' },
      { id: null, url: makeSearchUrl('Neso Academy CPU Scheduling FCFS'), thumb: os3, title: '7. CPU Scheduling - FCFS', desc: 'First Come First Served is the simplest scheduling algorithm. Processes are executed in the order of arrival. Convoy effect is a key disadvantage.', duration: '22m' },
      { id: null, url: makeSearchUrl('Neso Academy CPU Scheduling SJF'), thumb: os4, title: '8. CPU Scheduling - SJF', desc: 'Shortest Job First selects the process with the smallest burst time. It minimizes average waiting time but requires prior knowledge of burst times.', duration: '25m' },
      { id: null, url: makeSearchUrl('Neso Academy CPU Scheduling Round Robin'), thumb: os1, title: '9. CPU Scheduling - Round Robin', desc: 'Round Robin assigns equal time slices to each process in a circular order. It is fair and widely used in time-sharing systems for multitasking.', duration: '28m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Process Synchronization'), thumb: os2, title: '10. Process Synchronization', desc: 'Synchronization prevents race conditions when multiple processes share resources. It introduces critical section, mutual exclusion, and concurrency concepts.', duration: '18m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Semaphores'), thumb: os3, title: '11. Semaphores', desc: 'A semaphore is a signaling mechanism to control access to shared resources. Binary and counting semaphores are used to solve synchronization problems.', duration: '24m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Deadlock introduction'), thumb: os4, title: '12. Deadlock - Introduction', desc: 'A deadlock occurs when processes are permanently blocked waiting for each other. Four necessary conditions: mutual exclusion, hold and wait, no preemption, circular wait.', duration: '20m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Deadlock prevention avoidance'), thumb: os1, title: '13. Deadlock Prevention & Avoidance', desc: 'Prevention eliminates one of the four deadlock conditions. Avoidance uses algorithms like Banker\'s Algorithm to ensure the system stays in a safe state.', duration: '30m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Memory Management introduction'), thumb: os2, title: '14. Memory Management - Introduction', desc: 'Memory management allocates and tracks memory for processes. Concepts include logical vs physical address space, binding, and dynamic loading.', duration: '18m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Paging memory management'), thumb: os3, title: '15. Paging', desc: 'Paging divides physical memory into fixed-size frames and logical memory into pages. It eliminates external fragmentation using a page table.', duration: '28m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Segmentation memory management'), thumb: os4, title: '16. Segmentation', desc: 'Segmentation divides memory into variable-size segments based on logical divisions like code, stack, and heap. Supports user view of memory.', duration: '22m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Virtual Memory'), thumb: os1, title: '17. Virtual Memory', desc: 'Virtual memory allows processes to use more memory than physically available by loading only needed pages. This enables efficient multitasking.', duration: '20m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Page Replacement Algorithms FIFO LRU'), thumb: os2, title: '18. Page Replacement Algorithms', desc: 'When memory is full, a page must be replaced. Algorithms like FIFO, LRU, and Optimal decide which page to remove to minimize page faults.', duration: '35m' },
      { id: null, url: makeSearchUrl('Neso Academy OS File System'), thumb: os3, title: '19. File System', desc: 'A file system manages how data is stored and retrieved. It handles file naming, organization into directories, and access control policies.', duration: '22m' },
      { id: null, url: makeSearchUrl('Neso Academy OS Disk Scheduling FCFS SSTF SCAN'), thumb: os4, title: '20. Disk Scheduling', desc: 'Disk scheduling algorithms like FCFS, SSTF, SCAN, and C-SCAN decide the order to service disk I/O requests to minimize seek time.', duration: '30m' },
    ],
  },
  {
    key: 'CN',
    title: 'Computer Networks',
    description: 'Computer Networks covers how computers and devices communicate over wired or wireless connections. It includes protocols, architectures, data transmission, and internet infrastructure.',
    lecturer: 'Gate Smashers',
    totalHours: '11 hours',
    query: 'Gate Smashers Computer Networks full course',
    fallback: [
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks 1 Introduction'), thumb: cn1, title: '1. Introduction to Computer Networks', desc: 'A computer network connects devices to share resources. Networks are classified by geography (LAN, WAN, MAN) and topology (bus, star, ring, mesh).', duration: '18m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks OSI Model 7 layers'), thumb: cn2, title: '2. OSI Reference Model', desc: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Each layer has specific roles in data communication.', duration: '30m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks TCP IP model'), thumb: cn3, title: '3. TCP/IP Model', desc: 'The TCP/IP model is the practical internet framework with 4 layers. It maps to the OSI model and governs all internet communication.', duration: '22m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Physical Layer transmission media'), thumb: cn4, title: '4. Physical Layer - Transmission Media', desc: 'The physical layer transmits raw bits. Media types include twisted pair, coaxial cable, fiber optic (guided) and radio waves, microwaves (unguided).', duration: '25m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Data Link Layer framing error detection'), thumb: cn1, title: '5. Data Link Layer', desc: 'The data link layer handles framing, error detection (parity, CRC), and flow control. It ensures reliable transmission between adjacent network nodes.', duration: '28m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Error Detection CRC parity'), thumb: cn2, title: '6. Error Detection & Correction', desc: 'Error detection uses parity bits and CRC. Error correction uses Hamming code and forward error correction to identify and fix transmission errors.', duration: '35m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Flow Control Stop and Wait'), thumb: cn3, title: '7. Flow Control - Stop and Wait', desc: 'Stop and Wait protocol sends one frame and waits for acknowledgment before sending the next. Simple but inefficient for high-latency connections.', duration: '25m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Sliding Window protocol'), thumb: cn4, title: '8. Sliding Window Protocol', desc: 'Sliding window allows multiple frames to be sent before receiving ACKs. Go-Back-N and Selective Repeat are two variants covered in detail.', duration: '38m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks MAC protocols ALOHA CSMA'), thumb: cn1, title: '9. MAC Protocols - ALOHA & CSMA', desc: 'Medium Access Control protocols govern who transmits on a shared channel. Pure ALOHA, Slotted ALOHA, CSMA, CSMA/CD, and CSMA/CA are explained.', duration: '35m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Network Layer IP addressing'), thumb: cn2, title: '10. Network Layer & IP Addressing', desc: 'The network layer handles routing and IP addressing. IPv4 uses 32-bit addresses; subnetting divides networks into smaller parts for efficiency.', duration: '30m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Subnetting VLSM'), thumb: cn3, title: '11. Subnetting & VLSM', desc: 'Subnetting divides an IP network into smaller subnetworks. VLSM allows variable-length subnet masks for more flexible and efficient address allocation.', duration: '40m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Routing algorithms Distance Vector'), thumb: cn4, title: '12. Routing Algorithms', desc: 'Routing algorithms determine the best path for packets. Distance vector (RIP) and link state (OSPF) are two main types, each with unique characteristics.', duration: '35m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Transport Layer TCP UDP'), thumb: cn1, title: '13. Transport Layer - TCP & UDP', desc: 'TCP provides reliable, connection-oriented transfer with error checking and flow control. UDP is faster, connectionless, used for streaming and gaming.', duration: '30m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks TCP three way handshake'), thumb: cn2, title: '14. TCP Connection Establishment', desc: 'TCP uses a 3-way handshake (SYN, SYN-ACK, ACK) to establish connections. The 4-way handshake (FIN, FIN-ACK, ACK) is used for termination.', duration: '25m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Congestion Control TCP'), thumb: cn3, title: '15. Congestion Control', desc: 'TCP congestion control prevents network overload using slow start, congestion avoidance, fast retransmit, and fast recovery algorithms.', duration: '32m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Application Layer DNS HTTP'), thumb: cn4, title: '16. Application Layer - DNS & HTTP', desc: 'DNS translates domain names to IP addresses. HTTP is the protocol for web communication. This covers request/response cycles and DNS resolution.', duration: '28m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks SMTP FTP email protocols'), thumb: cn1, title: '17. Email & FTP Protocols', desc: 'SMTP sends emails, POP3/IMAP retrieve them. FTP transfers files between client and server. This covers these protocols with client-server architecture.', duration: '25m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Network Security cryptography'), thumb: cn2, title: '18. Network Security Basics', desc: 'Security covers encryption, authentication, and firewalls. Symmetric (AES) and asymmetric (RSA) cryptography are explained with digital signatures.', duration: '35m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks Wireless Networks WiFi 802.11'), thumb: cn3, title: '19. Wireless Networks', desc: 'Wireless networks use radio waves for communication. IEEE 802.11 (WiFi) standards, CDMA, GSM, and mobile network generations are covered.', duration: '28m' },
      { id: null, url: makeSearchUrl('Gate Smashers Computer Networks IPv6 addressing'), thumb: cn4, title: '20. IPv6 & Next-Gen Networking', desc: 'IPv6 uses 128-bit addresses solving IPv4 exhaustion. Features include simplified headers, auto-configuration, and built-in security with IPsec.', duration: '30m' },
    ],
  },
  {
    key: 'DBMS',
    title: 'Database Management Systems',
    description: 'DBMS enables users to create, manage, and manipulate databases. It provides an efficient way to store, retrieve, and secure data using structured query languages and normalization.',
    lecturer: 'Abdul Bari',
    totalHours: '9 hours',
    query: 'Abdul Bari DBMS database management systems',
    fallback: [
      { id: null, url: makeSearchUrl('Abdul Bari DBMS 1 Introduction to Database Management System'), thumb: db1, title: '1. Introduction to DBMS', desc: 'A DBMS stores and manages data efficiently. It provides data abstraction, integrity, security, and concurrent access over traditional file systems.', duration: '22m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS 2 ER Model Entity Relationship'), thumb: db2, title: '2. Entity Relationship Model', desc: 'The ER model conceptually designs databases. It represents entities with attributes and their relationships using a diagram before actual implementation.', duration: '35m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS 3 Relational Model'), thumb: db3, title: '3. Relational Model', desc: 'The relational model stores data in tables with rows and columns. It uses keys (primary, foreign) to establish and enforce relationships between tables.', duration: '28m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS SQL queries SELECT INSERT UPDATE DELETE'), thumb: db4, title: '4. SQL - Basic Queries', desc: 'SQL is used to interact with relational databases. Covers SELECT, INSERT, UPDATE, DELETE, and WHERE clause with practical query examples.', duration: '40m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS SQL Joins INNER LEFT RIGHT OUTER'), thumb: db1, title: '5. SQL Joins', desc: 'Joins combine rows from two or more tables. Inner join, left join, right join, full outer join, and cross join are explained with practical examples.', duration: '35m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS SQL aggregate functions GROUP BY HAVING'), thumb: db2, title: '6. SQL Aggregate Functions', desc: 'Aggregate functions like COUNT, SUM, AVG, MAX, MIN compute results over multiple rows. GROUP BY and HAVING are used for grouped aggregations.', duration: '30m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS SQL subqueries nested queries'), thumb: db3, title: '7. SQL Subqueries', desc: 'A subquery is a query inside another query. Covers correlated and non-correlated subqueries, EXISTS, IN, and ANY/ALL operators with examples.', duration: '32m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Normalization 1NF 2NF 3NF'), thumb: db4, title: '8. Normalization - 1NF, 2NF, 3NF', desc: 'Normalization reduces redundancy. 1NF eliminates repeating groups; 2NF removes partial dependencies; 3NF removes transitive dependencies.', duration: '45m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS BCNF Boyce Codd Normal Form'), thumb: db1, title: '9. BCNF - Boyce Codd Normal Form', desc: 'BCNF is a stricter version of 3NF. A relation is in BCNF if for every functional dependency, the left side is a superkey. Decomposition is covered.', duration: '30m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Functional Dependency Armstrong axioms'), thumb: db2, title: '10. Functional Dependencies', desc: 'Functional dependency captures the relationship between attributes. Armstrong axioms (reflexivity, augmentation, transitivity) derive all dependencies.', duration: '28m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Transactions ACID properties'), thumb: db3, title: '11. Transactions & ACID Properties', desc: 'A transaction is treated as a single unit. ACID properties — Atomicity, Consistency, Isolation, Durability — ensure reliable database transaction processing.', duration: '25m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Concurrency Control problems'), thumb: db4, title: '12. Concurrency Control', desc: 'When multiple transactions run simultaneously, concurrency issues arise: lost updates, dirty reads, unrepeatable reads. Concurrency control prevents these.', duration: '30m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Locking protocols two phase locking'), thumb: db1, title: '13. Locking Protocols', desc: 'Locking prevents conflicting accesses. Shared and exclusive locks, two-phase locking (2PL), and deadlock handling in databases are explained.', duration: '32m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Serializability schedules'), thumb: db2, title: '14. Serializability', desc: 'A schedule is serializable if its result equals a serial schedule. Conflict and view serializability are tested using precedence graphs.', duration: '35m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Indexing B tree B+ tree'), thumb: db3, title: '15. Indexing - B Trees & B+ Trees', desc: 'Indexing speeds up data retrieval. B trees and B+ trees are balanced tree structures used in databases for efficient search, insertion, and deletion.', duration: '40m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Hashing database'), thumb: db4, title: '16. Hashing in DBMS', desc: 'Hashing provides O(1) average access time by computing a hash key. Static and dynamic (extendible) hashing are explained with overflow handling.', duration: '28m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Recovery system log based'), thumb: db1, title: '17. Database Recovery', desc: 'Recovery restores the database to a consistent state after failure. Log-based recovery, checkpoints, undo/redo operations are explained.', duration: '30m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Relational Algebra operations'), thumb: db2, title: '18. Relational Algebra', desc: 'Relational algebra is a procedural query language. Operations: select, project, union, set difference, Cartesian product, and join are explained.', duration: '38m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS Views stored procedures'), thumb: db3, title: '19. Views & Stored Procedures', desc: 'A view is a virtual table based on a query. Stored procedures are precompiled SQL blocks. Both improve security, reusability, and performance.', duration: '25m' },
      { id: null, url: makeSearchUrl('Abdul Bari DBMS NoSQL databases types'), thumb: db4, title: '20. Introduction to NoSQL', desc: 'NoSQL databases handle unstructured data at scale. Types include document (MongoDB), key-value (Redis), column-family (Cassandra), and graph databases.', duration: '30m' },
    ],
  },
  {
    key: 'ML',
    title: 'Machine Learning',
    description: 'Machine Learning enables computers to learn from data and make decisions without explicit programming. It uses algorithms and statistical models to identify patterns and make predictions.',
    lecturer: 'Sentdex / 3Blue1Brown',
    totalHours: '14 hours',
    query: 'Machine Learning full course tutorial beginners 2024',
    fallback: [
      { id: null, url: makeSearchUrl('Machine Learning introduction supervised unsupervised reinforcement'), thumb: mlImg, title: '1. Introduction to Machine Learning', desc: 'ML allows computers to learn from experience. It covers supervised, unsupervised, and reinforcement learning based on data type and the learning approach.', duration: '28m' },
      { id: null, url: makeSearchUrl('Machine Learning Python numpy pandas matplotlib tutorial'), thumb: mlImg, title: '2. Python for ML - NumPy & Pandas', desc: 'NumPy provides array computation and Pandas handles tabular data. These are the core Python libraries required before learning machine learning algorithms.', duration: '40m' },
      { id: null, url: makeSearchUrl('Machine Learning Linear Regression tutorial'), thumb: mlImg, title: '3. Linear Regression', desc: 'Linear regression predicts continuous output from input features using a best-fit line. Covers hypothesis, cost function, and gradient descent optimization.', duration: '38m' },
      { id: null, url: makeSearchUrl('Machine Learning Gradient Descent optimization algorithm'), thumb: mlImg, title: '4. Gradient Descent', desc: 'Gradient descent iteratively minimizes a cost function by moving in the direction of the steepest descent. Batch, stochastic, and mini-batch variants explained.', duration: '32m' },
      { id: null, url: makeSearchUrl('Machine Learning Logistic Regression classification'), thumb: mlImg, title: '5. Logistic Regression', desc: 'Logistic regression is used for binary classification using the sigmoid function. Covers decision boundary, cost function, and multi-class extension.', duration: '35m' },
      { id: null, url: makeSearchUrl('Machine Learning Decision Tree algorithm Gini entropy'), thumb: mlImg, title: '6. Decision Trees', desc: 'Decision trees split data on feature values using Gini impurity or information gain (entropy). They are interpretable models for classification and regression.', duration: '38m' },
      { id: null, url: makeSearchUrl('Machine Learning Random Forest ensemble method'), thumb: mlImg, title: '7. Random Forest', desc: 'Random Forest is an ensemble of decision trees trained on random subsets. It reduces overfitting and improves accuracy through bagging and feature randomness.', duration: '35m' },
      { id: null, url: makeSearchUrl('Machine Learning Support Vector Machine SVM'), thumb: mlImg, title: '8. Support Vector Machines (SVM)', desc: 'SVM finds the optimal hyperplane that maximizes margin between classes. The kernel trick allows it to handle non-linearly separable data.', duration: '40m' },
      { id: null, url: makeSearchUrl('Machine Learning K Nearest Neighbors KNN classification'), thumb: mlImg, title: '9. K-Nearest Neighbors (KNN)', desc: 'KNN classifies a point based on the majority class of its K nearest neighbors. It is a simple, non-parametric, lazy learning algorithm.', duration: '28m' },
      { id: null, url: makeSearchUrl('Machine Learning Naive Bayes classifier'), thumb: mlImg, title: '10. Naive Bayes Classifier', desc: 'Naive Bayes applies Bayes theorem assuming features are independent. It is fast and effective for text classification and spam filtering.', duration: '30m' },
      { id: null, url: makeSearchUrl('Machine Learning K Means Clustering unsupervised'), thumb: mlImg, title: '11. K-Means Clustering', desc: 'K-Means partitions data into K clusters by minimizing intra-cluster variance. It is an unsupervised learning algorithm used for segmentation tasks.', duration: '32m' },
      { id: null, url: makeSearchUrl('Machine Learning Principal Component Analysis PCA dimensionality reduction'), thumb: mlImg, title: '12. PCA - Dimensionality Reduction', desc: 'PCA reduces the number of features while retaining maximum variance. It transforms data into principal components for visualization and speed.', duration: '35m' },
      { id: null, url: makeSearchUrl('Machine Learning Neural Networks introduction perceptron'), thumb: mlImg, title: '13. Neural Networks - Introduction', desc: 'Neural networks consist of input, hidden, and output layers of neurons. They learn patterns through forward propagation and update weights through backpropagation.', duration: '45m' },
      { id: null, url: makeSearchUrl('Machine Learning Backpropagation neural network training'), thumb: mlImg, title: '14. Backpropagation', desc: 'Backpropagation computes gradients of the loss function with respect to weights using the chain rule. It is the core algorithm for training neural networks.', duration: '40m' },
      { id: null, url: makeSearchUrl('Machine Learning CNN Convolutional Neural Network image classification'), thumb: mlImg, title: '15. Convolutional Neural Networks (CNN)', desc: 'CNNs use convolutional layers to extract spatial features from images. They are the standard architecture for image classification and object detection tasks.', duration: '55m' },
      { id: null, url: makeSearchUrl('Machine Learning RNN LSTM recurrent neural network sequence'), thumb: mlImg, title: '16. RNNs & LSTMs', desc: 'RNNs process sequential data by maintaining a hidden state. LSTMs solve the vanishing gradient problem using gates, enabling long-term dependency learning.', duration: '50m' },
      { id: null, url: makeSearchUrl('Machine Learning Overfitting underfitting bias variance'), thumb: mlImg, title: '17. Overfitting, Underfitting & Bias-Variance', desc: 'Overfitting memorizes training data. Underfitting fails to capture patterns. Bias-variance tradeoff guides model complexity for optimal generalization.', duration: '30m' },
      { id: null, url: makeSearchUrl('Machine Learning Cross Validation model evaluation'), thumb: mlImg, title: '18. Cross Validation', desc: 'Cross validation evaluates model performance by splitting data into multiple folds. K-fold CV gives a reliable estimate of model accuracy on unseen data.', duration: '28m' },
      { id: null, url: makeSearchUrl('Machine Learning Hyperparameter Tuning Grid Search'), thumb: mlImg, title: '19. Hyperparameter Tuning', desc: 'Hyperparameters control the learning process. Grid search, random search, and Bayesian optimization are used to find the best configuration.', duration: '32m' },
      { id: null, url: makeSearchUrl('Machine Learning Natural Language Processing NLP basics'), thumb: mlImg, title: '20. Intro to NLP', desc: 'NLP enables computers to understand human language. Covers tokenization, stemming, TF-IDF, word embeddings (Word2Vec), and basic text classification.', duration: '40m' },
    ],
  },
  {
    key: 'MPMC',
    title: 'Microprocessors & Microcontrollers',
    description: 'MPMC covers the architecture and programming of microprocessors like the 8085 and 8086, and microcontrollers like the 8051. It bridges hardware and software in embedded systems design.',
    lecturer: 'NPTEL / Bharat Acharya',
    totalHours: '8 hours',
    query: 'Microprocessors 8085 8086 microcontrollers 8051 tutorial',
    fallback: [
      { id: null, url: makeSearchUrl('Microprocessors introduction 8085 8086 overview'), thumb: mpmc1, title: '1. Introduction to Microprocessors', desc: 'A microprocessor integrates CPU functions on a single chip. It fetches, decodes, and executes instructions. The 8085 and 8086 are the most studied processors.', duration: '20m' },
      { id: null, url: makeSearchUrl('8085 microprocessor architecture internal registers'), thumb: mpmc1, title: '2. 8085 Architecture', desc: 'The 8085 is an 8-bit processor with a 16-bit address bus for 64KB memory. Its internal architecture includes ALU, registers (A, B, C, D, E, H, L), and a control unit.', duration: '35m' },
      { id: null, url: makeSearchUrl('8085 pin diagram description microprocessor'), thumb: mpmc1, title: '3. 8085 Pin Diagram', desc: 'The 8085 has 40 pins including address/data bus, control signals, interrupt lines, and power pins. Each pin\'s function is explained in detail.', duration: '30m' },
      { id: null, url: makeSearchUrl('8085 instruction set data transfer arithmetic logic'), thumb: mpmc1, title: '4. 8085 Instruction Set - Part 1', desc: 'The 8085 instruction set includes data transfer instructions (MOV, MVI, LDA, STA) and arithmetic instructions (ADD, SUB, INR, DCR) with examples.', duration: '38m' },
      { id: null, url: makeSearchUrl('8085 instruction set branching logical instructions'), thumb: mpmc1, title: '5. 8085 Instruction Set - Part 2', desc: 'Covers logical instructions (ANA, ORA, XRA, CMA), branching instructions (JMP, JZ, JNZ, CALL, RET), and machine control instructions for the 8085.', duration: '35m' },
      { id: null, url: makeSearchUrl('8085 assembly language programming examples'), thumb: mpmc1, title: '6. 8085 Assembly Language Programming', desc: 'Writing assembly programs for the 8085: finding largest/smallest number, addition of N numbers, sorting, and other basic programming examples.', duration: '42m' },
      { id: null, url: makeSearchUrl('8085 microprocessor timing diagram machine cycles'), thumb: mpmc1, title: '7. 8085 Timing Diagrams', desc: 'Timing diagrams show signal behavior during memory read, memory write, and I/O operations. Machine cycles, T-states, and bus cycles are explained.', duration: '30m' },
      { id: null, url: makeSearchUrl('8085 interrupts types RST INTR interrupt handling'), thumb: mpmc1, title: '8. 8085 Interrupts', desc: 'The 8085 supports 5 hardware interrupts: TRAP, RST 7.5, RST 6.5, RST 5.5, and INTR. Interrupt service routines and priority handling are covered.', duration: '28m' },
      { id: null, url: makeSearchUrl('8086 microprocessor architecture segmented memory'), thumb: mpmc1, title: '9. 8086 Architecture', desc: 'The 8086 is a 16-bit processor with a 20-bit address bus accessing 1MB memory. Features a BIU and EU, pipelining with instruction queue, and segmented memory.', duration: '40m' },
      { id: null, url: makeSearchUrl('8086 pin diagram multiplexed bus microprocessor'), thumb: mpmc1, title: '10. 8086 Pin Diagram', desc: 'The 8086 has a multiplexed 16-bit data/20-bit address bus. Pins include ALE, M/IO, RD, WR, and bus request/grant signals for maximum and minimum modes.', duration: '32m' },
      { id: null, url: makeSearchUrl('8086 instruction set addressing modes'), thumb: mpmc1, title: '11. 8086 Instruction Set & Addressing Modes', desc: 'The 8086 supports 7 addressing modes: immediate, register, direct, register indirect, based, indexed, and based indexed. Examples for each mode are given.', duration: '45m' },
      { id: null, url: makeSearchUrl('8086 assembly language programming examples'), thumb: mpmc1, title: '12. 8086 Assembly Programming', desc: 'Assembly language programs for the 8086: data movement, arithmetic, string operations, and procedures with full code examples in MASM syntax.', duration: '40m' },
      { id: null, url: makeSearchUrl('8086 interrupts INT instruction IRET'), thumb: mpmc1, title: '13. 8086 Interrupts', desc: 'The 8086 has hardware and software interrupts. INT instruction, IRET, interrupt vector table, and priority handling are explained with examples.', duration: '28m' },
      { id: null, url: makeSearchUrl('8051 microcontroller introduction architecture features'), thumb: mpmc1, title: '14. Introduction to 8051 Microcontroller', desc: 'The 8051 is an 8-bit microcontroller with 128B RAM, 4KB ROM, 2 timers, 1 UART, and 4 I/O ports on a single chip. It is ideal for embedded systems.', duration: '25m' },
      { id: null, url: makeSearchUrl('8051 microcontroller architecture internal registers SFR'), thumb: mpmc1, title: '15. 8051 Architecture & SFR', desc: 'The 8051 has accumulator, B register, PSW, stack pointer, data pointer, and Special Function Registers (SFR). Each is explained with memory map.', duration: '35m' },
      { id: null, url: makeSearchUrl('8051 instruction set assembly language programming'), thumb: mpmc1, title: '16. 8051 Instruction Set', desc: 'The 8051 instruction set covers data transfer (MOV), arithmetic (ADD, SUBB), logical (ANL, ORL), and branch instructions (JMP, CALL) with examples.', duration: '40m' },
      { id: null, url: makeSearchUrl('8051 timers counters programming'), thumb: mpmc1, title: '17. 8051 Timers & Counters', desc: 'The 8051 has two 16-bit timers/counters (T0 and T1). Modes 0-3 are explained with programming examples for delay generation and event counting.', duration: '35m' },
      { id: null, url: makeSearchUrl('8051 serial communication UART programming'), thumb: mpmc1, title: '18. 8051 Serial Communication', desc: 'The 8051 UART supports full-duplex serial communication. SBUF, SCON registers and all four serial port modes are explained with programming.', duration: '30m' },
      { id: null, url: makeSearchUrl('8051 interrupts IE IP register programming'), thumb: mpmc1, title: '19. 8051 Interrupts', desc: 'The 8051 has 5 interrupt sources: INT0, INT1, Timer0, Timer1, and Serial. IE and IP registers control enabling and priority of interrupts.', duration: '28m' },
      { id: null, url: makeSearchUrl('8051 interfacing LED LCD keyboard ADC'), thumb: mpmc1, title: '20. Interfacing with 8051', desc: 'Interfacing connects the 8051 to LEDs, keypads, LCDs, ADCs, and DACs. Practical circuit diagrams and programs for each peripheral are covered.', duration: '38m' },
    ],
  },
];

function SubjectSection({ subject }) {
  const [videos, setVideos] = useState([]);
  const { startWatching, markAsComplete, profile } = useProfile();
  const { fetchSubjectPlaylists, loading } = useYouTube();

  const isWatched = (vidId) => vidId && profile?.videosWatched?.some(v => v.id === vidId);

  useEffect(() => {
    fetchSubjectPlaylists(subject.key, subject.query, subject.fallback).then(mods => {
      if (mods) setVideos(mods.flat());
    });
  }, [subject.key]);

  const handleClick = (vid) => {
    const id = vid.id || vid.url;
    startWatching({ id, title: vid.title, thumb: vid.thumb, subject: subject.title });
  };

  const getVideoUrl = (vid) => {
    if (vid.id) return `https://www.youtube.com/watch?v=${vid.id}`;
    return vid.url || '#';
  };

  return (
    <div className="subject-section">
      <div className="subject-header">
        <div className="subject-header-left">
          <h1 className="subject-title">{subject.title}</h1>
          <p className="subject-desc">{subject.description}</p>
        </div>
        <div className="subject-meta">
          <div className="meta-row">
            <span className="meta-label">Lecturer:</span>
            <span className="meta-value">{subject.lecturer}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Total Hours:</span>
            <span className="meta-value">{subject.totalHours}</span>
          </div>
        </div>
      </div>

      {loading && videos.length === 0 ? (
        <p style={{ color: '#ccc' }}>Loading videos from YouTube...</p>
      ) : (
        <div className="playlist">
          {videos.map((vid, idx) => (
            <div className="item" key={idx}>
              <span className="num">{idx + 1}</span>
              <a
                href={getVideoUrl(vid)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(vid)}
              >
                <img src={vid.thumb} alt={vid.title} />
              </a>
              <div className="text" style={{ flex: 1 }}>
                <h3 dangerouslySetInnerHTML={{ __html: vid.title }}></h3>
                <p>{vid.desc}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingRight: '15px' }}>
                <span className="time">{vid.duration}</span>
                <input
                  type="checkbox"
                  checked={isWatched(vid.id)}
                  onChange={() => {
                    const id = vid.id || vid.url;
                    if (!isWatched(id)) markAsComplete({ id, title: vid.title, thumb: vid.thumb, subject: subject.title });
                  }}
                  style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#e50914' }}
                  title="Mark as completed"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Playlists() {
  const [activeSubject, setActiveSubject] = useState('All');

  const visibleSubjects =
    activeSubject === 'All'
      ? SUBJECTS
      : SUBJECTS.filter(s => s.key === activeSubject);

  return (
    <div className="playlists-body">
      <Navbar />
      <div className="container" style={{ paddingBottom: '60px' }}>
        <div className="subject-tabs">
          <button
            className={`tab-btn ${activeSubject === 'All' ? 'active' : ''}`}
            onClick={() => setActiveSubject('All')}
          >All Subjects</button>
          {SUBJECTS.map(s => (
            <button
              key={s.key}
              className={`tab-btn ${activeSubject === s.key ? 'active' : ''}`}
              onClick={() => setActiveSubject(s.key)}
            >{s.key}</button>
          ))}
        </div>

        {visibleSubjects.map(subject => (
          <SubjectSection key={subject.key} subject={subject} />
        ))}
      </div>
    </div>
  );
}
