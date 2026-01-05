import { useState, useCallback } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { parseAndValidateFile } from '@/utils/fileParser';
import { ParsedRow, ValidationError, IndicatorData, UploadSubmission } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function UploadData() {
  const { indicators, addIndicatorData, addSubmission } = useData();
  const { user } = useAuth();
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'preview' | 'validated' | 'failed' | 'submitted'>('idle');

  const enabledIndicators = indicators.filter(ind => ind.isEnabled && !ind.isDeleted);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('idle');
      setParsedRows([]);
      setErrors([]);
    }
  }, []);

  const handleParse = useCallback(async () => {
    if (!file) return;

    const content = await file.text();
    const { rows, errors: validationErrors, headers: fileHeaders } = parseAndValidateFile(content);

    setParsedRows(rows);
    setErrors(validationErrors);
    setHeaders(fileHeaders);
    setStatus(validationErrors.length === 0 ? 'validated' : 'failed');
  }, [file]);

  const handleSubmit = useCallback(() => {
    if (!selectedIndicator || !user) return;

    const indicator = indicators.find(ind => ind.id === selectedIndicator);
    if (!indicator) return;

    // Create indicator data entries
    const newData: IndicatorData[] = parsedRows
      .filter(row => row.isValid)
      .map((row, index) => ({
        id: `d-new-${Date.now()}-${index}`,
        indicatorId: selectedIndicator,
        year: row.year!,
        state: row.state,
        value: row.value!,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.id,
      }));

    addIndicatorData(newData);

    // Create submission record
    const submission: UploadSubmission = {
      id: `sub-${Date.now()}`,
      indicatorId: selectedIndicator,
      indicatorName: indicator.name,
      fileName: file?.name || 'unknown',
      status: 'approved',
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.id,
      rowCount: newData.length,
      errors: [],
    };

    addSubmission(submission);
    setStatus('submitted');
  }, [selectedIndicator, user, indicators, parsedRows, file, addIndicatorData, addSubmission]);

  const resetForm = () => {
    setFile(null);
    setParsedRows([]);
    setErrors([]);
    setHeaders([]);
    setStatus('idle');
    setSelectedIndicator('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Data</h1>
        <p className="text-muted-foreground">Upload Excel/CSV files for indicator data</p>
      </div>

      {status === 'submitted' ? (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Upload Successful!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your data has been validated and stored. The dashboard will reflect the new data.
            <Button variant="link" className="px-0 ml-2" onClick={resetForm}>
              Upload another file
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Indicator & File</CardTitle>
              <CardDescription>Choose the indicator and upload your data file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Indicator</label>
                  <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an indicator" />
                    </SelectTrigger>
                    <SelectContent>
                      {enabledIndicators.map(ind => (
                        <SelectItem key={ind.id} value={ind.id}>
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload File (CSV)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                        <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {file ? file.name : 'Click to select file'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleParse}
                disabled={!file || !selectedIndicator}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Parse & Validate
              </Button>
            </CardContent>
          </Card>

          {(status === 'validated' || status === 'failed') && (
            <>
              {/* Validation Status */}
              <Alert className={status === 'validated' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                {status === 'validated' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={status === 'validated' ? 'text-green-800' : 'text-red-800'}>
                  {status === 'validated' ? 'Validation Passed' : 'Validation Failed'}
                </AlertTitle>
                <AlertDescription className={status === 'validated' ? 'text-green-700' : 'text-red-700'}>
                  {status === 'validated'
                    ? `All ${parsedRows.length} rows are valid and ready to be submitted.`
                    : `Found ${errors.length} error(s) in the file. Please fix and re-upload.`}
                </AlertDescription>
              </Alert>

              {/* Error Details */}
              {errors.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Validation Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-48 overflow-y-auto">
                      <table className="gov-table">
                        <thead>
                          <tr>
                            <th>Row</th>
                            <th>Column</th>
                            <th>Error</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {errors.slice(0, 10).map((error, idx) => (
                            <tr key={idx}>
                              <td>{error.row}</td>
                              <td>{error.column}</td>
                              <td className="text-red-600">{error.message}</td>
                              <td className="font-mono text-sm">{error.value || '(empty)'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {errors.length > 10 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          ...and {errors.length - 10} more errors
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preview Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Preview</CardTitle>
                  <CardDescription>
                    Showing first 10 rows of {parsedRows.length} total rows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="gov-table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Year</th>
                          <th>State</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRows.slice(0, 10).map((row, idx) => (
                          <tr key={idx}>
                            <td>
                              {row.isValid ? (
                                <Badge className="bg-green-100 text-green-800">Valid</Badge>
                              ) : (
                                <Badge variant="destructive">Invalid</Badge>
                              )}
                            </td>
                            <td>{row.year ?? '-'}</td>
                            <td>{row.state || '-'}</td>
                            <td>{row.value?.toFixed(2) ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {status === 'validated' && (
                    <div className="mt-4 flex gap-2">
                      <Button onClick={handleSubmit}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Data
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
