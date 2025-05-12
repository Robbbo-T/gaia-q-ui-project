import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DocsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="3" x2="21" y1="9" y2="9" />
              <line x1="9" x2="9" y1="21" y2="9" />
            </svg>
            <span className="text-xl font-bold">GAIA-QAO Schema Explorer</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Explorer
            </a>
            <a
              href="https://github.com/gaia-qao/schema-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive documentation for the GAIA-QAO Object Identification System database schema
          </p>
        </div>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="structure">Schema Structure</TabsTrigger>
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>GAIA-QAO Object Identification System</CardTitle>
                <CardDescription>Database Schema Version 1.2.0</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The GAIA-QAO Object Identification System is a comprehensive, hierarchical identification framework
                  designed for aerospace objects across both atmospheric and space domains. It provides a standardized
                  method for uniquely identifying, categorizing, and tracking aerospace objects throughout their
                  lifecycle.
                </p>

                <h3 className="text-lg font-semibold mt-4">Key Features</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Unified identification system spanning traditional aviation, emerging air mobility concepts, and
                    space systems
                  </li>
                  <li>Specific accommodation for quantum-enhanced aerospace technologies</li>
                  <li>Compatibility with existing aerospace standards (ATA, CCSDS, etc.)</li>
                  <li>Support for object lifecycle management from design through decommissioning</li>
                  <li>Configuration tracking for different modifications</li>
                  <li>Centralized registry with federated nodes</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">ID Structure</h3>
                <p>
                  The GQOIS uses a hierarchical structure that encodes multiple levels of information about an aerospace
                  object:
                </p>
                <pre className="bg-muted p-4 rounded-md mt-2">DO-A-CCC-ST-MDL-SSSSS[-CC]</pre>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Component</th>
                        <th className="text-left p-2">Length</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">DO</td>
                        <td className="p-2">2 chars</td>
                        <td className="p-2">Domain</td>
                        <td className="p-2">AS (Air System)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">A</td>
                        <td className="p-2">1 char</td>
                        <td className="p-2">Autonomy Level</td>
                        <td className="p-2">M (Manned/Semi-Autonomous)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">CCC</td>
                        <td className="p-2">3 chars</td>
                        <td className="p-2">Functional Class</td>
                        <td className="p-2">PAX (Passenger Transport)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">ST</td>
                        <td className="p-2">2 chars</td>
                        <td className="p-2">Sub-Type</td>
                        <td className="p-2">BW (Blended Wing Body)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">MDL</td>
                        <td className="p-2">3 chars</td>
                        <td className="p-2">Model/Variant</td>
                        <td className="p-2">Q1H (AMPEL360 BWB-Q100)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">SSSSS</td>
                        <td className="p-2">5 chars</td>
                        <td className="p-2">Serial Number</td>
                        <td className="p-2">00001</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">CC</td>
                        <td className="p-2">2 chars</td>
                        <td className="p-2">Configuration Code (optional)</td>
                        <td className="p-2">A1 (Initial Configuration)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold mt-4">Example Complete ID</h3>
                <pre className="bg-muted p-4 rounded-md mt-2">AS-M-PAX-BW-Q1H-00001</pre>
                <p>This identifies:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>An Air System (AS)</li>
                  <li>That is Manned/Semi-Autonomous (M)</li>
                  <li>In the Passenger Transport class (PAX)</li>
                  <li>Of Blended Wing Body sub-type (BW)</li>
                  <li>Model AMPEL360 BWB-Q100 (Q1H)</li>
                  <li>Serial number 00001</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Schema Structure</CardTitle>
                <CardDescription>Detailed information about the database schema structure</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold">Core ID Component Tables</h3>
                      <p className="text-muted-foreground mb-4">
                        These tables form the foundation of the identification system, defining the hierarchical
                        structure of IDs.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">domains</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores domain definitions for the primary operational environment of aerospace objects.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>domain_code CHAR(2) PRIMARY KEY</code> - Two-character domain code
                            <br />
                            <code>name VARCHAR(100) NOT NULL</code> - Domain name
                            <br />
                            <code>description TEXT</code> - Detailed description
                            <br />
                            <code>altitude_boundary_meters INT</code> - Altitude boundary in meters
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">autonomy_levels</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores autonomy level definitions indicating the degree of human involvement in system
                            operation.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>autonomy_code CHAR(1) PRIMARY KEY</code> - Single-character autonomy code
                            <br />
                            <code>name VARCHAR(100) NOT NULL</code> - Autonomy level name
                            <br />
                            <code>description TEXT</code> - Detailed description
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">functional_classes</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores functional class definitions categorizing objects by their primary purpose or
                            function.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>class_code CHAR(3) PRIMARY KEY</code> - Three-character class code
                            <br />
                            <code>domain_code CHAR(2) NOT NULL</code> - Foreign key to domains
                            <br />
                            <code>name VARCHAR(100) NOT NULL</code> - Functional class name
                            <br />
                            <code>description TEXT</code> - Detailed description
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">subtypes</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores sub-type definitions that further refine the classification within each functional
                            class.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>subtype_id SERIAL PRIMARY KEY</code> - Auto-incrementing subtype ID
                            <br />
                            <code>subtype_code CHAR(2) NOT NULL</code> - Two-character subtype code
                            <br />
                            <code>class_code CHAR(3) NOT NULL</code> - Foreign key to functional_classes
                            <br />
                            <code>name VARCHAR(100) NOT NULL</code> - Sub-type name
                            <br />
                            <code>description TEXT</code> - Detailed description
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">models</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores model/variant definitions representing specific designs within a sub-type.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>model_id SERIAL PRIMARY KEY</code> - Auto-incrementing model ID
                            <br />
                            <code>model_code CHAR(3) NOT NULL</code> - Three-character model code
                            <br />
                            <code>subtype_id INT NOT NULL</code> - Foreign key to subtypes
                            <br />
                            <code>series_code CHAR(1)</code> - Foreign key to model_series
                            <br />
                            <code>size_code CHAR(1)</code> - Foreign key to model_size_categories
                            <br />
                            <code>variant_code CHAR(1)</code> - Foreign key to model_variant_types
                            <br />
                            <code>name VARCHAR(100) NOT NULL</code> - Model name
                            <br />
                            <code>technical_specifications JSONB</code> - Technical specifications in JSON format
                            <br />
                            <code>is_quantum_enhanced BOOLEAN</code> - Flag for quantum-enhanced systems
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold">Object Instances and Configurations</h3>
                      <p className="text-muted-foreground mb-4">
                        These tables track individual object instances and their configurations throughout their
                        lifecycle.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">object_instances</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores individual object instances with serial numbers.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>instance_id UUID PRIMARY KEY</code> - UUID for the instance
                            <br />
                            <code>model_id INT NOT NULL</code> - Foreign key to models
                            <br />
                            <code>serial_number CHAR(5) NOT NULL</code> - Five-character serial number
                            <br />
                            <code>full_object_id VARCHAR(30) NOT NULL</code> - Complete DO-A-CCC-ST-MDL-SSSSS identifier
                            <br />
                            <code>status VARCHAR(50) NOT NULL</code> - Status of the object (active, retired, etc.)
                            <br />
                            <code>owner_organization VARCHAR(100)</code> - Organization that owns the object
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">object_configurations</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores configuration variants for object instances.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>configuration_id SERIAL PRIMARY KEY</code> - Auto-incrementing configuration ID
                            <br />
                            <code>instance_id UUID NOT NULL</code> - Foreign key to object_instances
                            <br />
                            <code>configuration_code CHAR(2) NOT NULL</code> - Two-character configuration code
                            <br />
                            <code>type_code CHAR(1)</code> - Foreign key to configuration_types
                            <br />
                            <code>effective_from DATE NOT NULL</code> - Date from which this configuration is effective
                            <br />
                            <code>effective_to DATE</code> - Date until which this configuration is effective
                            <br />
                            <code>configuration_details JSONB</code> - Configuration details in JSON format
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold">Reference Tables</h3>
                      <p className="text-muted-foreground mb-4">
                        These tables provide standardized reference data for various components of the system.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">model_series</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Reference table for standardized model series/generation codes.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>series_code CHAR(1) PRIMARY KEY</code> - Single-character series code
                            <br />
                            <code>name VARCHAR(50) NOT NULL</code> - Series name
                            <br />
                            <code>description TEXT</code> - Detailed description
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">model_size_categories</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Reference table for standardized model size category codes.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>size_code CHAR(1) PRIMARY KEY</code> - Single-character size code
                            <br />
                            <code>name VARCHAR(50) NOT NULL</code> - Size category name
                            <br />
                            <code>description TEXT</code> - Detailed description
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">model_variant_types</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Reference table for standardized model variant type codes.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>variant_code CHAR(1) PRIMARY KEY</code> - Single-character variant code
                            <br />
                            <code>name VARCHAR(50) NOT NULL</code> - Variant type name
                            <br />
                            <code>description TEXT</code> - Detailed description
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">configuration_types</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Reference table for standardized configuration type codes.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>type_code CHAR(1) PRIMARY KEY</code> - Single-character type code
                            <br />
                            <code>name VARCHAR(50) NOT NULL</code> - Configuration type name
                            <br />
                            <code>description TEXT</code> - Detailed description
                            <br />
                            <code>domain_specific BOOLEAN</code> - Flag for domain-specific types
                            <br />
                            <code>domain_code CHAR(2)</code> - Foreign key to domains
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold">Registry Management</h3>
                      <p className="text-muted-foreground mb-4">
                        These tables manage the registry itself, including users, audit logs, and allocation requests.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">registry_users</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores users who can manage the registry.
                          </p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>user_id SERIAL PRIMARY KEY</code> - Auto-incrementing user ID
                            <br />
                            <code>username VARCHAR(50) NOT NULL UNIQUE</code> - Username
                            <br />
                            <code>email VARCHAR(100) NOT NULL UNIQUE</code> - Email address
                            <br />
                            <code>role VARCHAR(50) NOT NULL</code> - User role (admin, editor, viewer)
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">registry_audit_log</h4>
                          <p className="text-sm text-muted-foreground mb-2">Tracks changes to the registry.</p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>log_id SERIAL PRIMARY KEY</code> - Auto-incrementing log ID
                            <br />
                            <code>user_id INT</code> - Foreign key to registry_users
                            <br />
                            <code>action_type VARCHAR(50) NOT NULL</code> - Type of action (insert, update, delete)
                            <br />
                            <code>table_affected VARCHAR(50) NOT NULL</code> - Table that was affected
                            <br />
                            <code>record_id VARCHAR(50) NOT NULL</code> - Primary key of affected record
                            <br />
                            <code>old_values JSONB</code> - Previous values in JSON format
                            <br />
                            <code>new_values JSONB</code> - New values in JSON format
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">id_allocation_requests</h4>
                          <p className="text-sm text-muted-foreground mb-2">Manages requests for new IDs.</p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <code>request_id SERIAL PRIMARY KEY</code> - Auto-incrementing request ID
                            <br />
                            <code>requester_id INT NOT NULL</code> - Foreign key to registry_users
                            <br />
                            <code>domain_code CHAR(2) NOT NULL</code> - Foreign key to domains
                            <br />
                            <code>autonomy_code CHAR(1) NOT NULL</code> - Foreign key to autonomy_levels
                            <br />
                            <code>class_code CHAR(3) NOT NULL</code> - Foreign key to functional_classes
                            <br />
                            <code>quantity INT NOT NULL DEFAULT 1</code> - Number of serial numbers requested
                            <br />
                            <code>status VARCHAR(50) NOT NULL DEFAULT 'pending'</code> - Status of the request
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Usage Guide</CardTitle>
                <CardDescription>How to use the Schema Explorer tool</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold">Getting Started</h3>
                      <p className="mb-4">
                        The GAIA-QAO Schema Explorer is a web-based tool for exploring and visualizing the database
                        schema. This guide will help you get started with using the tool effectively.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Schema Overview</h4>
                          <p className="text-sm mb-2">
                            The Schema Overview tab provides a high-level view of the database schema, including:
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Schema statistics (total tables, relationships, etc.)</li>
                            <li>Visual diagrams of different parts of the schema</li>
                            <li>Tables grouped by category</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium">Interactive Explorer</h4>
                          <p className="text-sm mb-2">
                            The Interactive Explorer tab allows you to explore the schema in detail:
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Interactive diagram of tables and relationships</li>
                            <li>Search functionality to find tables and columns</li>
                            <li>Filtering by category</li>
                            <li>Detailed view of table structure, columns, and relationships</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold">Using the Interactive Explorer</h3>
                      <p className="mb-4">
                        The Interactive Explorer is the main feature of the tool. Here's how to use it effectively:
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Navigating the Diagram</h4>
                          <p className="text-sm mb-2">The diagram shows tables as nodes and relationships as edges:</p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Pan by clicking and dragging the background</li>
                            <li>Zoom using the mouse wheel or the controls in the top-right</li>
                            <li>Click "Fit View" to fit all visible nodes in the view</li>
                            <li>Click "Reset" to reset the view to the default position</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium">Searching and Filtering</h4>
                          <p className="text-sm mb-2">You can search for tables and columns, and filter by category:</p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Use the search box to find tables or columns by name</li>
                            <li>Use the category dropdown to filter tables by category</li>
                            <li>Use the checkboxes to show/hide primary keys, foreign keys, and indexes</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium">Viewing Table Details</h4>
                          <p className="text-sm mb-2">
                            Click on a table in the diagram or sidebar to view its details:
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Table Details tab shows general information about the table</li>
                            <li>Columns tab shows all columns and their properties</li>
                            <li>Relationships tab shows incoming and outgoing relationships</li>
                            <li>SQL Definition tab shows the SQL code to create the table</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold">Tips and Tricks</h3>
                      <p className="mb-4">Here are some tips to help you get the most out of the Schema Explorer:</p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Exploring Related Tables</h4>
                          <p className="text-sm mb-2">
                            When viewing a table's relationships, you can click the "View" button to navigate to related
                            tables.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium">Understanding Table Categories</h4>
                          <p className="text-sm mb-2">Tables are grouped into categories for easier navigation:</p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>
                              <strong>core</strong>: Core ID component tables
                            </li>
                            <li>
                              <strong>instance</strong>: Object instance tables
                            </li>
                            <li>
                              <strong>config</strong>: Configuration tables
                            </li>
                            <li>
                              <strong>registry</strong>: Registry management tables
                            </li>
                            <li>
                              <strong>reference</strong>: Reference tables
                            </li>
                            <li>
                              <strong>integration</strong>: Integration tables
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium">Identifying Key Fields</h4>
                          <p className="text-sm mb-2">The schema explorer uses icons to identify key fields:</p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>🔑 - Primary key</li>
                            <li>🔗 - Foreign key</li>
                          </ul>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Reference documentation for the Schema Explorer API</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold">API Overview</h3>
                      <p className="mb-4">
                        The Schema Explorer provides a REST API for programmatically accessing the database schema
                        information. This can be useful for integrating with other tools or automating tasks.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Base URL</h4>
                          <p className="text-sm mb-2">All API endpoints are relative to the base URL:</p>
                          <pre className="bg-muted p-3 rounded-md text-sm">
                            https://schema-explorer.gaia-qao.org/api
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-medium">Authentication</h4>
                          <p className="text-sm mb-2">API requests require authentication using an API key:</p>
                          <pre className="bg-muted p-3 rounded-md text-sm">Authorization: Bearer YOUR_API_KEY</pre>
                          <p className="text-sm mt-2">Contact the GAIA-QAO team to obtain an API key.</p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold">Endpoints</h3>
                      <p className="mb-4">The following endpoints are available:</p>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium">Get All Tables</h4>
                          <p className="text-sm mb-2">Returns a list of all tables in the schema.</p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                GET
                              </span>
                              <span>/tables</span>
                            </div>
                            <p className="mb-2">Query Parameters:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <code>category</code> - Filter by category (optional)
                              </li>
                              <li>
                                <code>search</code> - Search term for table name (optional)
                              </li>
                            </ul>
                            <p className="mt-2 mb-2">Response:</p>
                            <pre className="bg-muted-foreground/10 p-2 rounded">
                              {`{
  "tables": [
    {
      "name": "domains",
      "description": "Stores domain definitions...",
      "category": "core",
      "columnCount": 7
    },
    ...
  ],
  "total": 25
}`}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Get Table Details</h4>
                          <p className="text-sm mb-2">Returns detailed information about a specific table.</p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                GET
                              </span>
                              <span>/tables/{"{table_name}"}</span>
                            </div>
                            <p className="mb-2">Path Parameters:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <code>table_name</code> - Name of the table
                              </li>
                            </ul>
                            <p className="mt-2 mb-2">Response:</p>
                            <pre className="bg-muted-foreground/10 p-2 rounded">
                              {`{
  "name": "domains",
  "description": "Stores domain definitions...",
  "category": "core",
  "columns": [
    {
      "name": "domain_code",
      "type": "CHAR(2)",
      "isPrimaryKey": true,
      "isForeignKey": false,
      "isNullable": false,
      "description": "Primary key - two-character domain code"
    },
    ...
  ],
  "indexes": [
    {
      "name": "idx_domains_name",
      "columns": ["name"],
      "isUnique": true
    }
  ],
  "sqlDefinition": "CREATE TABLE domains (..."
}`}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Get Table Relationships</h4>
                          <p className="text-sm mb-2">Returns relationships for a specific table.</p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                GET
                              </span>
                              <span>/tables/{"{table_name}"}/relationships</span>
                            </div>
                            <p className="mb-2">Path Parameters:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <code>table_name</code> - Name of the table
                              </li>
                            </ul>
                            <p className="mt-2 mb-2">Response:</p>
                            <pre className="bg-muted-foreground/10 p-2 rounded">
                              {`{
  "incoming": [
    {
      "source": "functional_classes",
      "target": "domains",
      "type": "has",
      "sourceColumn": "domain_code",
      "targetColumn": "domain_code"
    },
    ...
  ],
  "outgoing": [
    {
      "source": "domains",
      "target": "functional_classes",
      "type": "has",
      "sourceColumn": "domain_code",
      "targetColumn": "domain_code"
    },
    ...
  ]
}`}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Search Schema</h4>
                          <p className="text-sm mb-2">Searches the schema for tables, columns, or relationships.</p>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                                GET
                              </span>
                              <span>/search</span>
                            </div>
                            <p className="mb-2">Query Parameters:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <code>q</code> - Search term
                              </li>
                              <li>
                                <code>type</code> - Type of search (table, column, relationship) (optional)
                              </li>
                            </ul>
                            <p className="mt-2 mb-2">Response:</p>
                            <pre className="bg-muted-foreground/10 p-2 rounded">
                              {`{
  "tables": [
    {
      "name": "models",
      "description": "Stores model/variant definitions...",
      "category": "core"
    },
    ...
  ],
  "columns": [
    {
      "name": "model_code",
      "table": "models",
      "type": "CHAR(3)",
      "description": "Three-character model code"
    },
    ...
  ],
  "relationships": [
    {
      "source": "models",
      "target": "object_instances",
      "type": "has"
    },
    ...
  ]
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold">Error Handling</h3>
                      <p className="mb-4">The API returns standard HTTP status codes and error responses:</p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Error Response Format</h4>
                          <p className="text-sm mb-2">Error responses have the following format:</p>
                          <pre className="bg-muted p-3 rounded-md text-sm">
                            {`{
  "error": {
    "code": "NOT_FOUND",
    "message": "Table 'unknown_table' not found",
    "details": { ... }
  }
}`}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-medium">Common Error Codes</h4>
                          <p className="text-sm mb-2">Common error codes include:</p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>
                              <code>UNAUTHORIZED</code> - Missing or invalid API key
                            </li>
                            <li>
                              <code>NOT_FOUND</code> - Requested resource not found
                            </li>
                            <li>
                              <code>BAD_REQUEST</code> - Invalid request parameters
                            </li>
                            <li>
                              <code>INTERNAL_ERROR</code> - Server error
                            </li>
                          </ul>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>GAIA-QAO Database Schema Explorer v1.0.0 | &copy; {new Date().getFullYear()} GAIA-QAO</p>
        </div>
      </footer>
    </main>
  )
}
